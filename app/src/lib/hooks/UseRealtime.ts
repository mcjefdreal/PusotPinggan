import { supabase } from '$lib/SupabaseClient';

export function subscribeToChat(chatId: string, callback: () => void) {
  return supabase
    .channel(`chat:${chatId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'message',
      filter: `chat_id=eq.${chatId}`
    }, callback)
    .subscribe();
}

export function subscribeToMessagesList(userId: string, callback: () => void) {
  return supabase
    .channel(`messages:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'message'
    }, callback)
    .subscribe();
}

export function subscribeToOnlineStatus(userIds: string[], callback: () => void) {
  return supabase
    .channel('online-status')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'user_status'
    }, callback)
    .subscribe();
}