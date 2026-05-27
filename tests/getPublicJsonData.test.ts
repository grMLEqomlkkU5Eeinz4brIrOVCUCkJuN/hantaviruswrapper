import { getPublicResponseInfo } from "../src/service/getPublicJsonData.js";
import { PublicJsonResponse } from "../src/types/publicJsonResponse.js";

describe("getPublicJsonData", () => {
	let result: PublicJsonResponse;

	beforeAll(async () => {
		result = await getPublicResponseInfo();
	});

	test("returns a defined response", () => {
		expect(result).toBeDefined();
	});

	test("meta contains expected fields", () => {
		expect(result.meta).toEqual(
			expect.objectContaining({
				tier: expect.any(String),
				delay: expect.any(String),
				generated_at: expect.any(String),
				license: expect.any(String),
				attribution: expect.any(String),
				docs: expect.any(String),
			})
		);
	});

	test("stats contains numeric counts", () => {
		expect(result.stats).toEqual(
			expect.objectContaining({
				confirmed_active: expect.any(Number),
				suspected: expect.any(Number),
				historical: expect.any(Number),
				deaths_total: expect.any(Number),
				countries_tracked: expect.any(Number),
			})
		);
	});

	test("countries is a non-empty array with valid entries", () => {
		expect(Array.isArray(result.countries)).toBe(true);
		expect(result.countries.length).toBeGreaterThan(0);

		const country = result.countries[0];
		expect(country).toEqual(
			expect.objectContaining({
				iso_a3: expect.any(String),
				code: expect.any(String),
				name: expect.any(String),
				status: expect.stringMatching(/^(active|suspected|lockdown|historical)$/),
				active: expect.any(Number),
				suspected: expect.any(Number),
				historical: expect.any(Number),
				deaths: expect.any(Number),
				trend: expect.stringMatching(/^(up|down|flat)$/),
			})
		);
	});

	test("map_markers is an array with valid entries", () => {
		expect(Array.isArray(result.map_markers)).toBe(true);
		expect(result.map_markers.length).toBeGreaterThan(0);

		const marker = result.map_markers[0];
		expect(marker).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				country_iso_a3: expect.any(String),
				city: expect.any(String),
				lat: expect.any(Number),
				lng: expect.any(Number),
				category: expect.stringMatching(/^(active|suspected|lockdown|historical)$/),
				strain: expect.any(String),
				cases: expect.any(Number),
				label: expect.any(String),
				ts: expect.any(String),
			})
		);
	});

	test("briefs is an array with valid entries", () => {
		expect(Array.isArray(result.briefs)).toBe(true);
		expect(result.briefs.length).toBeGreaterThan(0);

		const brief = result.briefs[0];
		expect(brief).toEqual(
			expect.objectContaining({
				ts: expect.any(String),
				tag: expect.stringMatching(/^(update|confirmed|resolved)$/),
				source: expect.any(String),
				title: expect.any(String),
			})
		);
	});

	test("outbreaks is an array with valid entries", () => {
		expect(Array.isArray(result.outbreaks)).toBe(true);
		expect(result.outbreaks.length).toBeGreaterThan(0);

		const outbreak = result.outbreaks[0];
		expect(outbreak).toEqual(
			expect.objectContaining({
				slug: expect.any(String),
				name: expect.any(String),
				strain: expect.any(String),
				origin: expect.any(String),
				onset: expect.any(String),
				status: expect.stringMatching(/^(active|resolved)$/),
				cases: expect.any(Number),
				deaths: expect.any(Number),
				countries: expect.any(Number),
				summary: expect.any(String),
			})
		);
	});
});