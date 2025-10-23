import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	// Get counts for dashboard stats
	const [reviewsResult, commentsResult, ticketsResult, contactResult] = await Promise.all([
		supabase.from('reviews').select('*', { count: 'exact', head: true }),
		supabase.from('review_comments').select('*', { count: 'exact', head: true }),
		supabase.from('ticket_requests').select('*', { count: 'exact', head: true }),
		supabase.from('contact_submissions').select('*', { count: 'exact', head: true })
	]);

	// Get pending items
	const [pendingComments, pendingTickets, pendingContact] = await Promise.all([
		supabase
			.from('review_comments')
			.select('*', { count: 'exact', head: true })
			.eq('approved', false),
		supabase
			.from('ticket_requests')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'pending'),
		supabase
			.from('contact_submissions')
			.select('*', { count: 'exact', head: true })
			.eq('read', false)
	]);

	// Get recent activity
	const [recentReviews, recentComments, recentTickets] = await Promise.all([
		supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(5),
		supabase
			.from('review_comments')
			.select('*, reviews(title)')
			.order('created_at', { ascending: false })
			.limit(5),
		supabase.from('ticket_requests').select('*').order('created_at', { ascending: false }).limit(5)
	]);

	return {
		stats: {
			reviews: reviewsResult.count || 0,
			comments: commentsResult.count || 0,
			tickets: ticketsResult.count || 0,
			contactMessages: contactResult.count || 0
		},
		pending: {
			comments: pendingComments.count || 0,
			tickets: pendingTickets.count || 0,
			contactMessages: pendingContact.count || 0
		},
		recentActivity: {
			reviews: recentReviews.data || [],
			comments: recentComments.data || [],
			tickets: recentTickets.data || []
		}
	};
};
