import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/home';

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      console.error('Code exchange failed: ', exchangeError.message)
      throw redirect(303, `/error?code=oauth_failed`);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Failed to get user: ', userError?.message);
      throw redirect(303, `/error?code=no_user`);
    }

    throw redirect(303, `/${next.slice(1)}`);
  }


  // return the user to an error page with instructions
  console.error('Invalid Callback');
  throw redirect(303, '/error?code=invalid_callback');
};