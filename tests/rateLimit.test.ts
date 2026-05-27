import { RateLimiter, RateLimitError } from "../src/rateLimit.js";

describe("RateLimiter", () => {
	test("allows requests within burst limit", () => {
		const limiter = new RateLimiter(60, 10);
		for (let i = 0; i < 10; i++) {
			expect(() => limiter.consume()).not.toThrow();
		}
	});

	test("throws RateLimitError when burst is exhausted", () => {
		const limiter = new RateLimiter(60, 5);
		for (let i = 0; i < 5; i++) {
			limiter.consume();
		}
		expect(() => limiter.consume()).toThrow(RateLimitError);
	});

	test("RateLimitError includes retryAfterMs", () => {
		const limiter = new RateLimiter(60, 1);
		limiter.consume();
		try {
			limiter.consume();
		} catch (e) {
			expect(e).toBeInstanceOf(RateLimitError);
			expect((e as RateLimitError).retryAfterMs).toBeGreaterThan(0);
		}
	});

	test("canRequest returns false when exhausted", () => {
		const limiter = new RateLimiter(60, 2);
		limiter.consume();
		limiter.consume();
		expect(limiter.canRequest()).toBe(false);
	});

	test("retryAfterMs returns 0 when tokens available", () => {
		const limiter = new RateLimiter(60, 10);
		expect(limiter.retryAfterMs).toBe(0);
	});

	test("tokens refill over time", async () => {
		const limiter = new RateLimiter(60_000, 1);
		limiter.consume();
		expect(limiter.canRequest()).toBe(false);

		await new Promise(r => setTimeout(r, 50));
		expect(limiter.canRequest()).toBe(true);
	});
});
