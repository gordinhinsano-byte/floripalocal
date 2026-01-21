import { supabase } from "@/lib/supabaseClient";

export async function getMyConversations() {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) throw new Error("Not logged in");

    const { data, error } = await supabase
        .from("conversations")
        .select("id, listing_id, buyer_id, seller_id, created_at, updated_at")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function getMessages(conversationId: string) {
    const { data, error } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, body, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
}

export async function sendMessage(conversationId: string, body: string) {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body,
    });

    if (error) throw error;
}

export async function getOrCreateConversation(listingId: string, buyerId: string, sellerId: string) {
    // tenta pegar existente
    const existing = await supabase
        .from("conversations")
        .select("id")
        .eq("listing_id", listingId)
        .eq("buyer_id", buyerId)
        .eq("seller_id", sellerId)
        .maybeSingle();

    if (existing.error && existing.error.code !== "PGRST116") {
        // PGRST116 = no rows
        throw existing.error;
    }

    if (existing.data?.id) return existing.data.id;

    // cria
    const created = await supabase
        .from("conversations")
        .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
        .select("id")
        .single();

    if (created.error) throw created.error;
    return created.data.id;
}
