export interface Review {
	id: string;
	name: string;
	slug: string;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	year?: number;
	description?: string;
	review_text?: string;
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
	email: string;
	phone?: string;
	quantity: number;
	preferred_date?: string;
	message?: string;
	status: string;
	created_at: string;
}

export interface ContactSubmission {
	id: string;
	name: string;
	email: string;
	subject?: string;
	message: string;
	created_at: string;
}
