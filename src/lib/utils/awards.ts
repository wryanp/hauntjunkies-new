import type { Review, AwardCategory, AwardData } from '$lib/types';
import { AWARD_CATEGORIES } from '$lib/types';

/**
 * Extract all Golden Ghost Awards from a review
 * @param review - The review to extract awards from
 * @returns Array of award data (category + year)
 */
export function getAwards(review: Review): AwardData[] {
	const awards: AwardData[] = [];

	if (review.award_best_actors_year) {
		awards.push({ category: 'best_actors', year: review.award_best_actors_year });
	}
	if (review.award_best_makeup_year) {
		awards.push({ category: 'best_makeup', year: review.award_best_makeup_year });
	}
	if (review.award_best_set_design_year) {
		awards.push({ category: 'best_set_design', year: review.award_best_set_design_year });
	}
	if (review.award_best_story_year) {
		awards.push({ category: 'best_story', year: review.award_best_story_year });
	}
	if (review.award_scariest_year) {
		awards.push({ category: 'scariest', year: review.award_scariest_year });
	}
	if (review.award_best_overall_year) {
		awards.push({ category: 'best_overall', year: review.award_best_overall_year });
	}

	return awards;
}

/**
 * Count the number of awards a review has won
 * @param review - The review to count awards for
 * @returns Number of awards
 */
export function getAwardCount(review: Review): number {
	return getAwards(review).length;
}

/**
 * Check if a review has won multiple awards
 * @param review - The review to check
 * @returns True if review has 2 or more awards
 */
export function hasMultipleAwards(review: Review): boolean {
	return getAwardCount(review) >= 2;
}

/**
 * Check if a review has any Golden Ghost Awards
 * @param review - The review to check
 * @returns True if review has at least one award
 */
export function hasGoldenGhostAwards(review: Review): boolean {
	return getAwardCount(review) > 0;
}

/**
 * Get award info (label, icon, description) for a category
 * @param category - The award category
 * @returns Award information object
 */
export function getAwardInfo(category: AwardCategory) {
	return AWARD_CATEGORIES[category];
}

/**
 * Format award display text
 * @param category - The award category
 * @param year - The year the award was won
 * @returns Formatted string like "🎭 Best Haunt Actors - 2024"
 */
export function formatAwardText(category: AwardCategory, year: number): string {
	const info = AWARD_CATEGORIES[category];
	return `${info.icon} ${info.label} - ${year}`;
}

/**
 * Group reviews by award year
 * @param reviews - Array of reviews
 * @returns Map of year -> reviews that won awards that year
 */
export function groupReviewsByAwardYear(reviews: Review[]): Map<number, Review[]> {
	const grouped = new Map<number, Review[]>();

	reviews.forEach((review) => {
		const awards = getAwards(review);
		awards.forEach((award) => {
			if (!grouped.has(award.year)) {
				grouped.set(award.year, []);
			}
			// Only add review once per year even if it won multiple awards
			const yearReviews = grouped.get(award.year)!;
			if (!yearReviews.find((r) => r.id === review.id)) {
				yearReviews.push(review);
			}
		});
	});

	return grouped;
}

/**
 * Get all unique years that awards have been given
 * @param reviews - Array of reviews
 * @returns Sorted array of years (newest first)
 */
export function getAwardYears(reviews: Review[]): number[] {
	const years = new Set<number>();

	reviews.forEach((review) => {
		const awards = getAwards(review);
		awards.forEach((award) => years.add(award.year));
	});

	return Array.from(years).sort((a, b) => b - a);
}

/**
 * Filter reviews to only those with Golden Ghost Awards
 * @param reviews - Array of reviews
 * @returns Array of reviews that have at least one award
 */
export function getAwardWinners(reviews: Review[]): Review[] {
	return reviews.filter(hasGoldenGhostAwards);
}

/**
 * Filter reviews to only those with multiple awards
 * @param reviews - Array of reviews
 * @returns Array of reviews that have 2 or more awards
 */
export function getMultiAwardWinners(reviews: Review[]): Review[] {
	return reviews.filter(hasMultipleAwards);
}

/**
 * Get reviews that won a specific category in a specific year
 * @param reviews - Array of reviews
 * @param category - The award category
 * @param year - The year (optional, if omitted returns all winners of this category)
 * @returns Array of matching reviews
 */
export function getReviewsByCategory(
	reviews: Review[],
	category: AwardCategory,
	year?: number
): Review[] {
	const fieldName = AWARD_CATEGORIES[category].fieldName;

	return reviews.filter((review) => {
		const awardYear = review[fieldName] as number | undefined;
		if (!awardYear) return false;
		if (year !== undefined) return awardYear === year;
		return true;
	});
}
