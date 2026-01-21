import { supabase } from "@/lib/supabaseClient";
import { Conversation, Message } from "@/types";

export async function createConversation(listingId: string, sellerId: string): Promise<Conversation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Check if conversation already exists
    const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .eq('listing_id', listingId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();

    if (existing) return existing;

    // Create new
    const { data, error } = await supabase
        .from('conversations')
        .insert({
            listing_id: listingId,
            buyer_id: user.id,
            seller_id: sellerId
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getMyConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch conversations where user is buyer OR seller
    // And join with listing details
    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            listing:listings(id, title, price, images)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function sendMessage(conversationId: string, body: string): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            body
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}
