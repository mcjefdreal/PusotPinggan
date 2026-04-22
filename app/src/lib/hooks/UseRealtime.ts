import { supabaseClient } from '$lib/SupabaseClient';

export function subscribeToChat(chatId: string, callback: () => void) {
  return supabaseClient
    .channel(`chat:${chatId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'message',
      filter: `chat_id=eq.${chatId}`
    }, () => {
      callback();
    })
    .subscribe();
}

export function subscribeToMessagesList(userId: string, callback: () => void) {
  return supabaseClient
    .channel(`messages:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'message'
    }, () => {
      callback();
    })
    .subscribe();
}