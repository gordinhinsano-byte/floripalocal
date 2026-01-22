-- RODE ESTE SCRIPT NO EDITOR SQL DO SUPABASE
-- Ele corrige o problema das notificações que não somem e permite marcar mensagens como lidas.

CREATE OR REPLACE FUNCTION mark_conversation_read(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE messages
  SET read_at = NOW()
  WHERE conversation_id = p_conversation_id
  AND sender_id != auth.uid()
  AND read_at IS NULL;
END;
$$;
