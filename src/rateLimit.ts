export class RateLimitError extends Error {
	public readonly retryAfterMs: number;

	constructor(retryAfterMs: number) {
		super(`Rate limit exceeded. Retry after ${Math.ceil(retryAfterMs)}ms`);
		this.name = "RateLimitError";
		this.retryAfterMs = Math.ceil(retryAfterMs);
	}
}

export class RateLimiter {
	private tokens: number;
	private lastRefill: number;
	private readonly maxTokens: number;
	private readonly refillRatePerMs: number;

	constructor(maxPerMinute: number = 60, burst: number = 120) {
		this.maxTokens = burst;
		this.tokens = burst;
		this.refillRatePerMs = maxPerMinute / 60_000;
		this.lastRefill = Date.now();
	}

	private refill(): void {
		const now = Date.now();
		const elapsed = now - this.lastRefill;
		this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRatePerMs);
		this.lastRefill = now;
	}

	canRequest(): boolean {
		this.refill();
		return this.tokens >= 1;
	}

	get retryAfterMs(): number {
		this.refill();
		if (this.tokens >= 1) return 0;
		return Math.ceil((1 - this.tokens) / this.refillRatePerMs);
	}

	consume(): void {
		this.refill();
		if (this.tokens < 1) {
			throw new RateLimitError(Math.ceil((1 - this.tokens) / this.refillRatePerMs));
		}
		this.tokens -= 1;
	}
}

export const rateLimiter = new RateLimiter();
