'use server';
type GetAllProps = {
	limit?: number;
	sort?: string;
	status?: string;
	path: string;
	page?: number;
	location?: string;
	propertyType?: string;
	propertyStatus?: string;
};
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

async function getAll({
	limit = 9999,
	sort = '-createdAt',
	status = 'published',
	location = '',
	propertyType = '',
	propertyStatus = '',
	path,
	page = 1,
}: GetAllProps) {
	const token = process.env.NEXT_PUBLIC_TOKEN;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers['authorization'] = `Bearer ${token}`; // Bearer prefix (adjust if not needed)
	}

	// Build query parameters
	const params = new URLSearchParams({
		limit: limit.toString(),
		sort,
		page: page.toString(),
		location,
		propertyType,
		listingType: propertyStatus,
	});

	// Always add the published status (assuming this is for published properties)
	params.append('status', 'published');

	const api = `${BASE_URL}/${path}?${params.toString()}`;
	// console.log('api::', api); // Debug log to see the URL

	const res = await fetch(api, {
		method: 'GET',
		next: { revalidate: 60 }, // ISR with 60-second revalidation
		headers,
	});

	if (!res.ok) {
		console.error(`Failed to fetch contents, Status: ${res.status}`);
		const errorText = await res.text();
		console.error('Error response:', errorText);
		return { doc: [] }; // Fallback to prevent crashes
	}

	const data = await res.json();
	return data; // Expected format: { doc: [...] }
}

export default getAll;
