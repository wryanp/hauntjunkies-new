/**
 * US State abbreviations to full names mapping
 */
const STATE_NAMES: Record<string, string> = {
	'AL': 'Alabama',
	'AK': 'Alaska',
	'AZ': 'Arizona',
	'AR': 'Arkansas',
	'CA': 'California',
	'CO': 'Colorado',
	'CT': 'Connecticut',
	'DE': 'Delaware',
	'FL': 'Florida',
	'GA': 'Georgia',
	'HI': 'Hawaii',
	'ID': 'Idaho',
	'IL': 'Illinois',
	'IN': 'Indiana',
	'IA': 'Iowa',
	'KS': 'Kansas',
	'KY': 'Kentucky',
	'LA': 'Louisiana',
	'ME': 'Maine',
	'MD': 'Maryland',
	'MA': 'Massachusetts',
	'MI': 'Michigan',
	'MN': 'Minnesota',
	'MS': 'Mississippi',
	'MO': 'Missouri',
	'MT': 'Montana',
	'NE': 'Nebraska',
	'NV': 'Nevada',
	'NH': 'New Hampshire',
	'NJ': 'New Jersey',
	'NM': 'New Mexico',
	'NY': 'New York',
	'NC': 'North Carolina',
	'ND': 'North Dakota',
	'OH': 'Ohio',
	'OK': 'Oklahoma',
	'OR': 'Oregon',
	'PA': 'Pennsylvania',
	'RI': 'Rhode Island',
	'SC': 'South Carolina',
	'SD': 'South Dakota',
	'TN': 'Tennessee',
	'TX': 'Texas',
	'UT': 'Utah',
	'VT': 'Vermont',
	'VA': 'Virginia',
	'WA': 'Washington',
	'WV': 'West Virginia',
	'WI': 'Wisconsin',
	'WY': 'Wyoming',
	'DC': 'District of Columbia'
};

/**
 * Convert state abbreviation to full name
 * @param abbreviation - Two-letter state abbreviation (e.g., 'NC')
 * @returns Full state name (e.g., 'North Carolina') or the abbreviation if not found
 */
export function getStateName(abbreviation: string | null | undefined): string {
	if (!abbreviation) return '';
	const upperAbbr = abbreviation.toUpperCase();
	return STATE_NAMES[upperAbbr] || abbreviation;
}

/**
 * Get all state abbreviations
 * @returns Array of state abbreviations
 */
export function getStateAbbreviations(): string[] {
	return Object.keys(STATE_NAMES);
}

/**
 * Get all state names
 * @returns Array of state names
 */
export function getStateNames(): string[] {
	return Object.values(STATE_NAMES);
}
