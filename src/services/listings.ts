import { supabase } from "@/lib/supabaseClient";
import { Listing } from "@/types";

export async function createListing(listing: Partial<Listing>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
        .from('listings')
        .insert({
            ...listing,
            owner_id: user.id,
            status: 'draft',
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteListing(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // RLS policies should prevent deleting other users' listings
    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id); // Extra safety

    if (error) throw error;
    return true;
}

export async function updateListing(id: string, updates: Partial<Listing>) {
    const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getListingById(id: string): Promise<Listing | null> {
    const { data, error } = await supabase
        .from('listings')
        .select(`
            *,
            profiles:owner_id (
                name,
                phone,
                avatar_url
            )
        `)
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

export async function getMyListings(): Promise<Listing[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export interface SearchParams {
    categoryId?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    attributes?: Record<string, any>;
}

export async function searchListings(params: SearchParams): Promise<Listing[]> {
    // We will NOT send p_attrs to RPC because strict JSONB matching often fails 
    // with arrays vs strings or partial matches. We filter client-side below.
    const { data, error } = await supabase.rpc('search_listings', {
        p_category_id: params.categoryId || null,
        p_city: params.city || null,
        p_price_min: params.minPrice || null,
        p_price_max: params.maxPrice || null,
        p_attrs: {} // Empty to get all results, then filter in JS
    });

    if (error) {
        console.error("RPC Error:", error);
        return [];
    }
    
    let results = data || [];

    // Client-side Attribute Filtering (Robust)
    if (params.attributes && Object.keys(params.attributes).length > 0) {
        results = results.filter(ad => {
            const adAttrs = ad.attributes || {};
            
            return Object.entries(params.attributes || {}).every(([key, requiredValue]) => {
                // Skip special internal keys if any leak here
                if (!requiredValue) return true;

                const adValue = adAttrs[key];

                // If ad doesn't have the attribute at all, it fails filter
                if (adValue === undefined || adValue === null) return false;

                // Case 1: Required is boolean (e.g. checkbox "true")
                if (typeof requiredValue === 'boolean' || requiredValue === 'true') {
                     return String(adValue) === 'true';
                }

                // Case 2: Required is Array (e.g. multi-select)
                if (Array.isArray(requiredValue)) {
                    // Ad value must match ONE of the required (OR logic) or ALL (AND logic)?
                    // Usually filters are "Is one of these".
                    // If Ad value is scalar: is it in required array?
                    // If Ad value is array: do they intersect?
                    
                    const reqArray = requiredValue.map(String);
                    
                    if (Array.isArray(adValue)) {
                        // Intersection
                        return adValue.some(v => reqArray.includes(String(v)));
                    } else {
                        return reqArray.includes(String(adValue));
                    }
                }

                // Case 3: Required is String
                const reqStr = String(requiredValue).toLowerCase();
                
                if (Array.isArray(adValue)) {
                    // Ad has list of services ["A", "B"], looking for "A"
                    return adValue.some(v => String(v).toLowerCase() === reqStr);
                } else {
                    // Exact match (case-insensitive)
                    return String(adValue).toLowerCase() === reqStr;
                }
            });
        });
    }

    return results;
}

export async function getRecentListings(limit = 8): Promise<Listing[]> {
    const ADULT_CATEGORIES = [
        'acompanhantes',
        'acompanhantes-trans',
        'acompanhantes-masculinos',
        'encontros'
    ];

    // Fetch a bit more than limit to account for client-side filtering
    const { data, error } = await supabase
        .from('listings')
        .select(`
            *,
            profiles:owner_id (
                name,
                phone,
                avatar_url
            )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit * 2);

    if (error) {
        console.error("Error fetching recent listings:", error);
        return [];
    }

    // Filter client-side to avoid RPC/Syntax issues with complex NOT IN queries
    const filtered = (data || []).filter(ad => {
        // Safe access to category_id
        const catId = (ad.category_id || '').toLowerCase();
        
        // 1. Check Category ID
        if (ADULT_CATEGORIES.some(adult => catId === adult || catId.includes(adult))) {
            return false;
        }

        // 2. Extra safety: Check Title for adult keywords
        // This prevents ads that might be miscategorized or have vague category IDs from appearing
        const title = (ad.title || '').toLowerCase();
        const forbiddenWords = ['acompanhante', 'sexo', 'massagem erótica', 'massagem erotica', 'garota de programa', 'gp', 'trans', 'travesti'];
        
        if (forbiddenWords.some(word => title.includes(word))) {
            return false;
        }

        return true;
    });

    return filtered.slice(0, limit);
}

export async function uploadListingImage(file: File, listingId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Path: {user_id}/{listing_id}/{timestamp}-{filename}
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${listingId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function uploadListingVideo(file: File, listingId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const fileExt = file.name.split('.').pop();
    const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${listingId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file, { contentType: file.type || undefined });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

    return publicUrl;
}

// Favorites Functions
export async function toggleFavorite(listingId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Check if already favorited
    const { data: existing, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle();

    if (existing) {
        // Remove
        const { error: deleteError } = await supabase
            .from('favorites')
            .delete()
            .eq('id', existing.id);
            
        if (deleteError) throw deleteError;
        
        return false; // Not favorited anymore
    } else {
        // Add
        const { error: insertError } = await supabase
            .from('favorites')
            .insert({
                user_id: user.id,
                listing_id: listingId
            });
            
        if (insertError) throw insertError;
        
        return true; // Favorited
    }
}

export async function getFavorites(): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

    return data?.map(f => f.listing_id) || [];
}

export async function getFavoriteListings(): Promise<Listing[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('favorites')
        .select(`
            listing:listing_id (
                *,
                profiles:owner_id (
                    name,
                    phone,
                    avatar_url
                )
            )
        `)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching favorite listings:", error);
        return [];
    }

    // Map the nested result back to a flat Listing array
    // @ts-ignore
    return data?.map(item => item.listing).filter(Boolean) || [];
}

export async function incrementListingView(id: string) {
    // Try RPC first if available (safer for concurrency)
    const { error } = await supabase.rpc('increment_listing_counter', {
        listing_id: id,
        counter_type: 'view'
    });

    if (error) {
        console.warn("RPC increment_listing_counter failed, falling back.", error);
        // Fallback for JSONB update without RPC is hard to do atomically client-side without risk
        // We will just read-modify-write
        const { data } = await supabase.from('listings').select('analytics').eq('id', id).single();
        const analytics = data?.analytics || {};
        const views = (analytics.views || 0) + 1;
        await supabase.from('listings').update({ 
            analytics: { ...analytics, views } 
        }).eq('id', id);
    }
}

export async function incrementListingClick(id: string, type: 'whatsapp' | 'email') {
    const { error } = await supabase.rpc('increment_listing_counter', {
        listing_id: id,
        counter_type: type
    });

    if (error) {
         console.warn("RPC increment_listing_counter failed, falling back.", error);
         const key = type === 'whatsapp' ? 'whatsapp_clicks' : 'email_clicks';
         const { data } = await supabase.from('listings').select('analytics').eq('id', id).single();
         const analytics = data?.analytics || {};
         const current = (analytics[key] || 0) + 1;
         await supabase.from('listings').update({ 
            analytics: { ...analytics, [key]: current } 
         }).eq('id', id);
    }
}
