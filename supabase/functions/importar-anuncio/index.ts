import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

type ImportRequest = {
  url: string;
  user_id: string;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...corsHeaders,
    },
  });
}

function extractMeta(html: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=(?:"|')${escaped}(?:"|')[^>]+content=(?:"|')([^"']+)(?:"|')[^>]*>`,
    "i",
  );
  const m = html.match(re);
  return (m?.[1] || "").trim();
}

function extractTitle(html: string): string {
  const og = extractMeta(html, "og:title");
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return (m?.[1] || "").trim();
}

function extractDescription(html: string): string {
  const og = extractMeta(html, "og:description");
  if (og) return og;
  const m = html.match(
    /<meta[^>]+name=(?:"|')description(?:"|')[^>]+content=(?:"|')([^"']+)(?:"|')[^>]*>/i,
  );
  return (m?.[1] || "").trim();
}

function extractImages(html: string, baseUrl: URL): string[] {
  const candidates: string[] = [];
  const og = extractMeta(html, "og:image");
  if (og) candidates.push(og);

  const imgRe = /<img[^>]+src=(?:"|')([^"']+)(?:"|')[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = imgRe.exec(html))) {
    const raw = (match[1] || "").trim();
    if (!raw) continue;
    candidates.push(raw);
    if (candidates.length >= 20) break;
  }

  const normalized = candidates
    .map((src) => {
      try {
        return new URL(src, baseUrl).toString();
      } catch {
        return "";
      }
    })
    .filter((u) => u.startsWith("http://") || u.startsWith("https://"));

  return Array.from(new Set(normalized)).slice(0, 6);
}

function extractPrice(html: string): number | null {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 20000);

  const m = text.match(/R\$\s*([\d.]+(?:,\d{1,2})?)/i);
  if (!m?.[1]) return null;
  const n = Number(m[1].replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return jsonResponse(500, { error: "Missing server configuration" });
  }

  const authHeader = req.headers.get("authorization") || "";
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data: userData } = await userClient.auth.getUser();
  const user = userData.user;
  if (!user) return jsonResponse(401, { error: "Unauthorized" });

  let body: ImportRequest;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const urlStr = (body.url || "").trim();
  if (!urlStr) return jsonResponse(400, { error: "URL é obrigatória" });
  const requestedUserId = (body.user_id || "").trim();
  if (!requestedUserId) return jsonResponse(400, { error: "user_id é obrigatório" });

  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return jsonResponse(400, { error: "URL inválida" });
  }

  if (requestedUserId !== user.id) {
    return jsonResponse(403, { error: "user_id não confere com o usuário autenticado" });
  }

  const categorySlug = "acompanhantes";
  const fetchUrl = `https://r.jina.ai/${url.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(fetchUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return jsonResponse(502, { error: "Falha ao buscar anúncio de origem" });
    }
    const html = await res.text();

    const title = extractTitle(html) || `Anúncio importado - ${url.hostname}`;
    const description =
      extractDescription(html) || `Importado automaticamente de ${url.hostname}`;
    const images = extractImages(html, url);
    const price = extractPrice(html);

    const serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });

    const attributes = {
      import_url: url.toString(),
      import_source: url.hostname,
      imported_at: new Date().toISOString(),
    };

    const { data, error } = await serviceClient.rpc("importar_anuncio", {
      p_owner_id: user.id,
      p_category_slug: categorySlug,
      p_title: title,
      p_description: description,
      p_price: price,
      p_city: null,
      p_state: null,
      p_neighborhood: null,
      p_images: images,
      p_attributes: attributes,
    });

    if (error) {
      console.error("RPC importar_anuncio error", error);
      return jsonResponse(500, { error: "Falha ao inserir anúncio no destino" });
    }

    return jsonResponse(200, { listingId: data });
  } catch (e) {
    console.error("Import error", e);
    return jsonResponse(500, { error: "Erro ao importar anúncio" });
  }
});
