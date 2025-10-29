import { INSTAGRAM_ACCESS_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// Check if token is configured
		if (!INSTAGRAM_ACCESS_TOKEN) {
			console.error('[Instagram API] Access token not configured');
			return json({ error: 'Instagram API not configured' }, { status: 500 });
		}

		// Fetch posts from Instagram Graph API
		// Get the last 12 posts with media details
		const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=12&access_token=${INSTAGRAM_ACCESS_TOKEN}`;

		const response = await fetch(url);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('[Instagram API] Failed to fetch posts:', errorText);
			return json({ error: 'Failed to fetch Instagram posts' }, { status: response.status });
		}

		const data = await response.json();

		// Transform the data to a simpler format
		const posts = data.data.map((post: any) => ({
			id: post.id,
			caption: post.caption || '',
			mediaType: post.media_type,
			mediaUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
			permalink: post.permalink,
			timestamp: post.timestamp
		}));

		// Cache for 1 hour
		return json(
			{ posts },
			{
				headers: {
					'Cache-Control': 'public, max-age=3600'
				}
			}
		);
	} catch (error) {
		console.error('[Instagram API] Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
