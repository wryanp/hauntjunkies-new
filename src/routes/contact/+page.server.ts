import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
		const formData = await request.formData();

		const name = formData.get('name')?.toString();
		const email = formData.get('email')?.toString();
		const subject = formData.get('subject')?.toString() || null;
		const message = formData.get('message')?.toString();

		if (!name || !email || !message) {
			return fail(400, { error: 'Please fill out all required fields' });
		}

		const { error: insertError } = await supabase
			.from('contact_submissions')
			.insert({
				name,
				email,
				subject,
				message
			});

		if (insertError) {
			console.error('Error inserting contact submission:', insertError);
			return fail(500, { error: 'Failed to send message. Please try again.' });
		}

		return { success: true };
	}
};
