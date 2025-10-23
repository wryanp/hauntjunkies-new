export interface Review {
	id: string;
	name: string;
	slug: string;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	year?: number;
	review_date?: string; // The date the haunt was actually visited
	description?: string;
	review_text?: string; // Can contain placeholders like [REVIEWER_PHOTO:1] for inline images
	featured: boolean;
	rating_overall?: number;
	rating_scares?: number;
	rating_atmosphere?: number;
	rating_value?: number;
	cover_image_url?: string;
	website_url?: string;
	facebook_url?: string;
	instagram_url?: string;
	twitter_url?: string;
	youtube_url?: string;
	view_count?: number; // Total number of times this review has been viewed
	last_viewed_at?: string; // Timestamp of the most recent view
	created_at: string;
	updated_at: string;
}

export interface ReviewImage {
	id: string;
	review_id: string;
	image_url: string;
	caption?: string;
	display_order: number;
	created_at: string;
}

export interface ReviewerPhoto {
	id: string;
	review_id: string;
	image_url: string;
	caption?: string;
	alt_text?: string;
	display_order: number;
	created_at: string;
}

export interface ReviewComment {
	id: string;
	review_id: string;
	author_name: string;
	author_email: string;
	comment_text: string;
	approved: boolean;
	created_at: string;
}

export interface HeroMessage {
	id: string;
	message?: string;
	is_active: boolean;
	updated_at: string;
}

export interface McCloudInfo {
	id: string;
	title: string;
	description?: string;
	story?: string;
	dates?: string;
	hours?: string;
	pricing?: string;
	address?: string;
	video_url?: string;
	updated_at: string;
}

export interface McCloudPhoto {
	id: string;
	image_url: string;
	caption?: string;
	display_order: number;
	created_at: string;
}

export interface TicketRequest {
	id: string;
	name: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	date?: string;
	tickets: number;
	special_requests?: string;
	confirmation_number?: string;
	status: string;
	created_at: string;
	// Legacy fields for backward compatibility
	quantity?: number;
	preferred_date?: string;
	message?: string;
}

export interface TicketDate {
	id: string;
	date: string;
	start_time?: string;
	end_time?: string;
	capacity: number;
	max_tickets_per_request: number;
	notes?: string;
	is_available: boolean;
	created_at: string;
	updated_at: string;
}

export interface ContactSubmission {
	id: string;
	name: string;
	email: string;
	subject?: string;
	message: string;
	created_at: string;
}

export interface Quote {
	id: string;
	text: string;
	by: string;
	is_active: boolean;
	display_order: number;
	created_at: string;
}
