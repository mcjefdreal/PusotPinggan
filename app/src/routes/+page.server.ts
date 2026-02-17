import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // safeGetSession is the helper we defined in hooks.server.ts
  const { session } = await locals.safeGetSession();

  // If the cookie contains a valid session, redirect to home
  if (session) {
    throw redirect(303, '/home');
  }

  return {};
};

// src/routes/login/+page.server.ts

export const actions: Actions = {
  // We name the action 'google'
  google: async ({ locals, url }) => {
    // Generate the OAuth URL on the server
    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // You can still use the origin or a hardcoded prod URL
        // Use the current request origin so the redirect matches the running host
        redirectTo: `${url.origin}/auth/callback`,
      }
    });

    if (error) {
      return fail(500, { message: 'Server error: ' + error.message });
    }

    // The data.url is the Google consent page URL
    if (data.url) {
      throw redirect(303, data.url);
    }

    return fail(500, { message: 'Could not generate login URL' });
  }
};