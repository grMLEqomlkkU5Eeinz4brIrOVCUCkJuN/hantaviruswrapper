import { getPublicResponseInfo } from "../src/service/getPublicJsonData.js";
import { PublicJsonResponse } from "../src/types/publicJsonResponse.js";
import {
	getCountryByCode,
	getCountryByIso,
	getCountriesByStatus,
	getCountriesByTrend,
	searchCountriesByName,
} from "../src/service/filterCountries.js";

describe("filterCountries", () => {
	let data: PublicJsonResponse;

	beforeAll(async () => {
		data = await getPublicResponseInfo();
	});

	describe("getCountryByCode", () => {
		test("finds a country by its code", () => {
			const first = data.countries[0];
			const result = getCountryByCode(data, first.code);
			expect(result).toEqual(first);
		});

		test("is case-insensitive", () => {
			const first = data.countries[0];
			const result = getCountryByCode(data, first.code.toUpperCase());
			expect(result).toEqual(first);
		});

		test("returns undefined for unknown code", () => {
			expect(getCountryByCode(data, "ZZZZZ")).toBeUndefined();
		});
	});

	describe("getCountryByIso", () => {
		test("finds a country by its iso_a3", () => {
			const first = data.countries[0];
			const result = getCountryByIso(data, first.iso_a3);
			expect(result).toEqual(first);
		});

		test("returns undefined for unknown iso", () => {
			expect(getCountryByIso(data, "ZZZ")).toBeUndefined();
		});
	});

	describe("getCountriesByStatus", () => {
		test("returns only countries matching the given status", () => {
			const first = data.countries[0];
			const results = getCountriesByStatus(data, first.status);
			expect(results.length).toBeGreaterThan(0);
			expect(results.every(c => c.status === first.status)).toBe(true);
		});
	});

	describe("getCountriesByTrend", () => {
		test("returns only countries matching the given trend", () => {
			const first = data.countries[0];
			const results = getCountriesByTrend(data, first.trend);
			expect(results.length).toBeGreaterThan(0);
			expect(results.every(c => c.trend === first.trend)).toBe(true);
		});
	});

	describe("searchCountriesByName", () => {
		test("finds countries by partial name match", () => {
			const first = data.countries[0];
			const partial = first.name.substring(0, 3);
			const results = searchCountriesByName(data, partial);
			expect(results.length).toBeGreaterThan(0);
			expect(results.some(c => c.name === first.name)).toBe(true);
		});

		test("is case-insensitive", () => {
			const first = data.countries[0];
			const results = searchCountriesByName(data, first.name.toUpperCase());
			expect(results.some(c => c.name === first.name)).toBe(true);
		});

		test("returns empty array for no match", () => {
			expect(searchCountriesByName(data, "xyznonexistent")).toEqual([]);
		});
	});
});
