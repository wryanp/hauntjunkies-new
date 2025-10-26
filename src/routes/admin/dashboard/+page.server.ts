import type { PageServerLoad, Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';

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
			.select('*, reviews(name)')
			.order('created_at', { ascending: false })
			.limit(5),
		supabase.from('ticket_requests').select('*').order('created_at', { ascending: false }).limit(5)
	]);

	// Get awards hero setting
	const { data: awardsHeroSetting } = await supabase
		.from('site_settings')
		.select('*')
		.eq('setting_key', 'show_awards_hero')
		.single();

	// Mock ticket data for demo if no real tickets exist
	const mockTickets = [
		{
			id: 'mock-1',
			name: 'John Smith',
			first_name: 'John',
			last_name: 'Smith',
			email: 'john.smith@email.com',
			phone: '555-0101',
			tickets: 4,
			date: '2024-10-31',
			preferred_date: '2024-10-31',
			special_requests: null,
			status: 'confirmed',
			created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
		},
		{
			id: 'mock-2',
			name: 'Sarah Johnson',
			first_name: 'Sarah',
			last_name: 'Johnson',
			email: 'sarah.j@email.com',
			phone: '555-0102',
			tickets: 2,
			date: '2024-11-01',
			preferred_date: '2024-11-01',
			special_requests: null,
			status: 'confirmed',
			created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
		},
		{
			id: 'mock-3',
			name: 'Michael Brown',
			first_name: 'Michael',
			last_name: 'Brown',
			email: 'mbrown@email.com',
			phone: '555-0103',
			tickets: 6,
			date: '2024-10-31',
			preferred_date: '2024-10-31',
			special_requests: 'Wheelchair accessible',
			status: 'confirmed',
			created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
		},
		{
			id: 'mock-4',
			name: 'Emily Davis',
			first_name: 'Emily',
			last_name: 'Davis',
			email: 'emily.davis@email.com',
			phone: '555-0104',
			tickets: 3,
			date: '2024-11-02',
			preferred_date: '2024-11-02',
			special_requests: null,
			status: 'confirmed',
			created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
		}
	];

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
			tickets: (recentTickets.data && recentTickets.data.length > 0) ? recentTickets.data : mockTickets
		},
		showAwardsHero: awardsHeroSetting?.setting_value?.enabled ?? false
	};
};

export const actions: Actions = {
	toggleAwardsHero: async ({ cookies }) => {
		// Verify admin authentication
		const adminSession = cookies.get('admin_session');
		if (!adminSession) {
			return fail(401, { error: 'Unauthorized' });
		}

		const supabase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
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

		// Get current setting
		const { data: currentSetting } = await supabase
			.from('site_settings')
			.select('*')
			.eq('setting_key', 'show_awards_hero')
			.single();

		const currentValue = currentSetting?.setting_value?.enabled ?? false;

		// Update setting
		const { error } = await supabase
			.from('site_settings')
			.update({
				setting_value: { enabled: !currentValue }
			})
			.eq('setting_key', 'show_awards_hero');

		if (error) {
			console.error('Error toggling awards hero:', error);
			return fail(500, { error: 'Failed to update setting' });
		}

		return {
			success: true,
			showAwardsHero: !currentValue
		};
	}
};
