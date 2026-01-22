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

export async function getUnreadSummary(): Promise<{ total: number; byConversation: Record<string, number> }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { total: 0, byConversation: {} };

    const { data: convs } = await supabase
        .from('conversations')
        .select('id,buyer_id,seller_id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
    const conversationIds = (convs || []).map(c => c.id);
    if (conversationIds.length === 0) return { total: 0, byConversation: {} };

    const { data: msgs } = await supabase
        .from('messages')
        .select('id,conversation_id,sender_id,read_at')
        .in('conversation_id', conversationIds)
        .is('read_at', null);
    const unread = (msgs || []).filter(m => m.sender_id !== user.id);

    const byConversation: Record<string, number> = {};
    unread.forEach(m => {
        byConversation[m.conversation_id] = (byConversation[m.conversation_id] || 0) + 1;
    });
    const total = unread.length;
    return { total, byConversation };
}

export async function markConversationRead(conversationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Tenta via RPC (Recomendado: ignora RLS restritivo)
    const { error: rpcError } = await supabase.rpc('mark_conversation_read', {
        p_conversation_id: conversationId
    });

    if (!rpcError) return; // Sucesso via RPC

    // 2. Fallback: Update direto na tabela (Funciona se as Policies permitirem)
    // Fetch unread messages specifically to update them by ID
    const { data: unreadMessages, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null);

    if (fetchError) {
        console.error("Error fetching unread messages:", fetchError);
        return;
    }

    if (!unreadMessages || unreadMessages.length === 0) return;

    const ids = unreadMessages.map(m => m.id);

    const { error: updateError } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', ids);
    
    if (updateError) {
        console.error("Error marking messages as read:", updateError);
        // Não lançamos erro aqui para não quebrar a UI, mas logamos
    }
}
