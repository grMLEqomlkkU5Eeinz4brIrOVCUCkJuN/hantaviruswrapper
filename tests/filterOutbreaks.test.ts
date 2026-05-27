import { getPublicResponseInfo } from "../src/service/getPublicJsonData.js";
import { PublicJsonResponse } from "../src/types/publicJsonResponse.js";
import {
	getOutbreakBySlug,
	getOutbreaksByStatus,
	getOutbreaksByStrain,
	searchOutbreaksByName,
	getOutbreaksByOrigin,
} from "../src/service/filterOutbreaks.js";

describe("filterOutbreaks", () => {
	let data: PublicJsonResponse;

	beforeAll(async () => {
		data = await getPublicResponseInfo();
	});

	describe("getOutbreakBySlug", () => {
		test("finds an outbreak by its slug", () => {
			const first = data.outbreaks[0];
			const result = getOutbreakBySlug(data, first.slug);
			expect(result).toEqual(first);
		});

		test("returns undefined for unknown slug", () => {
			expect(getOutbreakBySlug(data, "nonexistent-slug")).toBeUndefined();
		});
	});

	describe("getOutbreaksByStatus", () => {
		test("returns only outbreaks matching the given status", () => {
			const first = data.outbreaks[0];
			const results = getOutbreaksByStatus(data, first.status);
			expect(results.length).toBeGreaterThan(0);
			expect(results.every(o => o.status === first.status)).toBe(true);
		});
	});

	describe("getOutbreaksByStrain", () => {
		test("finds outbreaks by partial strain match", () => {
			const first = data.outbreaks[0];
			const partial = first.strain.substring(0, 3);
			const results = getOutbreaksByStrain(data, partial);
			expect(results.length).toBeGreaterThan(0);
			expect(results.some(o => o.strain === first.strain)).toBe(true);
		});

		test("is case-insensitive", () => {
			const first = data.outbreaks[0];
			const results = getOutbreaksByStrain(data, first.strain.toUpperCase());
			expect(results.some(o => o.strain === first.strain)).toBe(true);
		});

		test("returns empty array for no match", () => {
			expect(getOutbreaksByStrain(data, "xyznonexistent")).toEqual([]);
		});
	});

	describe("searchOutbreaksByName", () => {
		test("finds outbreaks by partial name match", () => {
			const first = data.outbreaks[0];
			const partial = first.name.substring(0, 3);
			const results = searchOutbreaksByName(data, partial);
			expect(results.length).toBeGreaterThan(0);
			expect(results.some(o => o.name === first.name)).toBe(true);
		});

		test("returns empty array for no match", () => {
			expect(searchOutbreaksByName(data, "xyznonexistent")).toEqual([]);
		});
	});

	describe("getOutbreaksByOrigin", () => {
		test("finds outbreaks by partial origin match", () => {
			const first = data.outbreaks[0];
			const partial = first.origin.substring(0, 3);
			const results = getOutbreaksByOrigin(data, partial);
			expect(results.length).toBeGreaterThan(0);
			expect(results.some(o => o.origin === first.origin)).toBe(true);
		});

		test("returns empty array for no match", () => {
			expect(getOutbreaksByOrigin(data, "xyznonexistent")).toEqual([]);
		});
	});
});
