export class GenericRequestError extends Error {
	constructor(endpoint: string, status?: number, message?: string) {
		super(`AUR API error on ${endpoint}: ${status ? `HTTP ${status}` : message}`);
		this.name = 'AURError';
	}
}