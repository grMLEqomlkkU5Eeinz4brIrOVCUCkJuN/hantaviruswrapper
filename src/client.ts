import { GenericRequestError } from "./types/GenericRequestError.js";
import { rateLimiter } from "./rateLimit.js";

export const BASE_URL = "https://hantaosint.com/api/v1";

// the shape of this client will change in the future, i literally copied this from another project lol
export const hantaVirusClient = async <T>(endpoint: string, path?: string, requestType: string = 'GET'): Promise<T> => {
	rateLimiter.consume();

	const requestUrl = new URL(`${BASE_URL}${endpoint}`);

	// naming this request body since it is confusing occasionally
	let reqBody: URLSearchParams | undefined;

	if (path) requestUrl.pathname += `/${path}`;

	try {
		const response = await fetch(requestUrl.toString(), {
			method: requestType,
			headers: {
				'Accept': 'application/json'
			},
			body: reqBody
		});

		// the api does not return error result (or if it does, it isn't documented) and it honestly does not matter for now since we are not doing any searching
		const data = await response.json() as T;

		if (!response.ok || (data && typeof data === "object" && "error" in data)) {
			throw new Error(`hantaosint error: ${response.status}`);
		}

		return data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new GenericRequestError(endpoint, undefined, error.message);
		}
		throw new GenericRequestError(endpoint);
	}
};