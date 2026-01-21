import { Ad, AdFilter, User } from "@/types";
import { supabase } from "@/lib/supabaseClient";

type ListingRow = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category_id: string;
  type: string | null;
  city: string | null;
  state: string | null;
  images: string[] | null;
  owner_id: string | null;
  status: string;
  created_at: string;
  attributes: Record<string, any> | null;
};

function mapListingToAd(row: ListingRow): Ad {
  // If we have category_slug injected (via join or manual injection), use it.
  // Otherwise fallback to category_id or 'outros'.
  const slug = (row as any).category_slug || "outros";

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price ?? 0),
    categorySlug: slug,
    location: {
      state: row.state || "Brasil",
      city: row.city || undefined,
    },
    images: row.images || [],
    video: undefined, // Column 'video' does not exist
    userId: row.owner_id || "",
    status: (row.status as any) || "active",
    isPremium: false, // Column 'is_premium' does not exist
    isVerified: false, // Column 'is_verified' does not exist
    views: 0, // Column 'views' does not exist
    createdAt: row.created_at,
    updatedAt: row.created_at, // Column 'updated_at' does not exist, fallback to created_at
    attributes: row.attributes || {},
  };
}

function buildFilterJson(filter: AdFilter): Record<string, string> {
  const json: Record<string, string> = {};
  Object.entries(filter).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (["category", "state", "query", "minPrice", "maxPrice", "userId"].includes(k)) return;
    json[k] = String(v);
  });
  // Normalize min/max price to the convention used by the SQL function
  if (filter.minPrice !== undefined) json["price_min"] = String(filter.minPrice);
  if (filter.maxPrice !== undefined) json["price_max"] = String(filter.maxPrice);
  return json;
}

export const api = {
  // Ads
  getAds: async (filter: AdFilter = {}): Promise<Ad[]> => {
    // 1. If category is filtered, get the proper category_id from the slug
    let categoryId: string | null = null;
    if (filter.category) {
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", filter.category)
        .single();

      if (!catError && catData) {
        categoryId = catData.id;
      }
    }

    // 2. Build the main query on 'listings' table (vanilla Supabase, no RPC)
    let query = supabase
      .from("listings")
      .select("id,title,description,price,category_id,city,state,images,owner_id,status,created_at,attributes,type")
      .eq("status", "active");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (filter.state && filter.state !== "TODO BRASIL") {
      query = query.eq("state", filter.state);
    }

    if (filter.query) {
      // Basic text search on title/description
      query = query.or(`title.ilike.%${filter.query}%,description.ilike.%${filter.query}%`);
    }

    if (filter.userId) {
      query = query.eq("owner_id", filter.userId);
    }

    // Sort order (default recent)
    query = query.order("created_at", { ascending: false });

    // Client-side filtering for attributes/price would happen here 
    // or we can add .gte/.lte if possible. For dynamic attributes, 
    // Supabase filtering on JSONB columns needs specific syntax (->>) which is hard in chained wrapper.
    // However, basic price filtering:
    if (filter.minPrice !== undefined) query = query.gte("price", filter.minPrice);
    if (filter.maxPrice !== undefined && filter.maxPrice < 999999999) query = query.lte("price", filter.maxPrice);

    const { data, error } = await query;

    if (error) {
      console.error("[api.getAds]", error);
      return [];
    }

    const rows = (data || []) as any[];

    // Map rows to Ad. Note: row has category_id, not category_slug. 
    // We might need to fetch category slug if Ad type requires it? 
    // For now, let's keep categorySlug empty or try to infer? 
    // The Ad type requires categorySlug. We can just fill it with the filter.category or a placeholder if missing.
    return rows.map(r => ({
      ...mapListingToAd(r),
      categorySlug: filter.category || "unknown" // Best effort
    }));
  },

  getAdById: async (id: string): Promise<Ad | null> => {
    if (!id) return null;

    const { data, error } = await supabase
      .from("listings")
      .select(
        "id,title,description,price,category_id,city,state,images,owner_id,status,created_at,attributes,type"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[api.getAdById]", error);
      throw error;
    }

    if (!data) return null;

    return mapListingToAd(data as unknown as ListingRow);
  },

  createAd: async (adData: Partial<Ad>): Promise<Ad> => {
    // Requires authenticated user because of RLS policy.
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) throw new Error("Você precisa estar logado para publicar.");

    // Resolve category_slug -> category_id
    const categorySlug = adData.categorySlug || "outros";
    console.log('[publish] slug recebido:', categorySlug);

    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    console.log('[publish] categoria encontrada:', catData, 'erro:', catError);

    if (catError || !catData) {
      throw new Error("Categoria inválida ou não encontrada: " + categorySlug);
    }
    const categoryId = catData.id;

    const payload = {
      title: adData.title || "",
      description: adData.description || "",
      price: adData.price ?? null,
      category_id: categoryId,
      state: adData.location?.state || null,
      city: adData.location?.city || null,
      images: adData.images || [],
      owner_id: userId,
      status: "active",
      attributes: adData.attributes || {},
      type: "produto", // Default type as required by DB
    };

    const { data, error } = await supabase
      .from("listings")
      .insert(payload)
      .select(
        "id,title,description,price,category_id,city,state,images,owner_id,status,created_at,attributes,type"
      )
      .single();

    if (error) throw error;

    // Return Ad object. We can reuse mapListingToAd but need to handle category_id -> category_slug mismatch?
    // Ideally we return what we just created. mapListingToAd expects category_slug. We can inject it back.
    const createdRow = { ...data, category_slug: categorySlug } as any;
    return mapListingToAd(createdRow);
  },

  // Minimal Auth helpers (optional for now)
  loginWithPassword: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  registerWithPassword: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },

  getUser: async (id: string): Promise<User | undefined> => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return undefined;

    return {
      id: user.id,
      name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || "Usuário",
      email: user.email || "",
      type: user.user_metadata?.user_type || "particular",
      createdAt: user.created_at,
    };
  },
};
