import { supabase } from "./supabaseClient";

export async function pingImportarAnuncio() {
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) throw sessErr;
  if (!session) throw new Error("Sem sessão/logado");

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error("VITE_SUPABASE_ANON_KEY não carregou (reinicia o npm run dev)");

  const res = await fetch("https://plubjqspxikmpviazjcm.functions.supabase.co/importar-anuncio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ ping: true }),
  });

  return { status: res.status, body: await res.text() };
}

export async function importarAnuncio(url) {
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) throw sessErr;

  console.log("SESSION?", !!session);
  console.log("ACCESS TOKEN?", session?.access_token?.slice(0, 20));
  console.log("USER ID?", session?.user?.id);

  if (!session?.access_token) throw new Error("Sem access_token (usuário não logado)");

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error("VITE_SUPABASE_ANON_KEY não carregou (reinicia o npm run dev)");

  const res = await fetch(
    "https://plubjqspxikmpviazjcm.functions.supabase.co/importar-anuncio",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        url,
        user_id: session.user.id,
      }),
    }
  );

  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("BODY:", text);

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
