import { createCachedFetcher } from "../src/cache.js";

describe("createCachedFetcher", () => {
	test("returns data on first call", async () => {
		const fetcher = createCachedFetcher(60_000);
		const result = await fetcher();
		expect(result).toBeDefined();
		expect(result.meta).toBeDefined();
		expect(result.countries).toBeDefined();
	});

	test("returns cached data on subsequent calls", async () => {
		const fetcher = createCachedFetcher(60_000);
		const first = await fetcher();
		const second = await fetcher();
		expect(first).toBe(second);
	});

	test("invalidate forces a fresh fetch", async () => {
		const fetcher = createCachedFetcher(60_000);
		const first = await fetcher();
		fetcher.invalidate();
		const second = await fetcher();
		expect(second).toBeDefined();
		expect(second.meta).toBeDefined();
	});
});
