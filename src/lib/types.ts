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
	caption?: string; // Short caption displayed on cards and "About" section
	description?: string;
	review_text?: string; // Can contain placeholders like [REVIEWER_PHOTO:1] for inline images
	featured: boolean;
	rating_overall?: number;
	rating_scares?: number;
	rating_atmosphere?: number;
	rating_value?: number;
	cover_image_url?: string;
	review_image?: string; // Social media thumbnail image for sharing
	website_url?: string;
	facebook_url?: string;
	instagram_url?: string;
	twitter_url?: string;
	tiktok_url?: string;
	youtube_url?: string;
	view_count?: number; // Total number of times this review has been viewed
	last_viewed_at?: string; // Timestamp of the most recent view
	// Golden Ghost Award fields
	award_best_actors_year?: number;
	award_best_makeup_year?: number;
	award_best_set_design_year?: number;
	award_best_story_year?: number;
	award_scariest_year?: number;
	award_best_overall_year?: number;
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
	approval_token?: string;
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

export interface SiteSettings {
	id: string;
	setting_key: string;
	setting_value: {
		enabled: boolean;
	};
	description?: string;
	updated_at: string;
	created_at: string;
}

// Golden Ghost Award Types
export type AwardCategory =
	| 'best_actors'
	| 'best_makeup'
	| 'best_set_design'
	| 'best_story'
	| 'scariest'
	| 'best_overall';

export interface AwardInfo {
	label: string;
	icon: string;
	description: string;
	fieldName: keyof Review;
	imagePath: string;
}

export const AWARD_CATEGORIES: Record<AwardCategory, AwardInfo> = {
	best_actors: {
		label: 'Best Haunt Actors',
		icon: '🎭',
		description: 'Outstanding performance and character portrayal',
		fieldName: 'award_best_actors_year',
		imagePath: '/Best_Haunt_Actors_Badge.webp'
	},
	best_makeup: {
		label: 'Best Haunt Makeup',
		icon: '💄',
		description: 'Exceptional makeup and prosthetics artistry',
		fieldName: 'award_best_makeup_year',
		imagePath: '/Best_Haunt_Makeup_Badge.webp'
	},
	best_set_design: {
		label: 'Best Set Design',
		icon: '🏛️',
		description: 'Immersive environments and scenic design',
		fieldName: 'award_best_set_design_year',
		imagePath: '/Best_Set_Design_Badge.webp'
	},
	best_story: {
		label: 'Best Haunt Story',
		icon: '📖',
		description: 'Compelling narrative and storytelling',
		fieldName: 'award_best_story_year',
		imagePath: '/Best_Haunt_Story_Badge.webp'
	},
	scariest: {
		label: 'Scariest Haunt',
		icon: '😱',
		description: 'Most terrifying and intense experience',
		fieldName: 'award_scariest_year',
		imagePath: '/Scariest_Haunt_Badge.webp'
	},
	best_overall: {
		label: 'Best Overall Haunt',
		icon: '👑',
		description: 'The ultimate haunt experience - our highest honor',
		fieldName: 'award_best_overall_year',
		imagePath: '/Best_Overall_Haunt_Badge.webp'
	}
};

export interface AwardData {
	category: AwardCategory;
	year: number;
}
