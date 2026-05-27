import { getPublicResponseInfo } from "./service/getPublicJsonData.js";
import { PublicJsonResponse } from "./types/publicJsonResponse.js";

export interface CachedFetcher {
	(): Promise<PublicJsonResponse>;
	invalidate(): void;
}

export const createCachedFetcher = (ttlMs: number = 300_000): CachedFetcher => {
	let cached: PublicJsonResponse | null = null;
	let cachedAt = 0;

	const fetcher = async (): Promise<PublicJsonResponse> => {
		const now = Date.now();
		if (cached && (now - cachedAt) < ttlMs) {
			return cached;
		}
		cached = await getPublicResponseInfo();
		cachedAt = Date.now();
		return cached;
	};

	fetcher.invalidate = () => {
		cached = null;
		cachedAt = 0;
	};

	return fetcher;
};
