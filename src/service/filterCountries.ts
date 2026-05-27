import { Country, CountryStatus, Trend } from "../types/BaseResponse.js";
import { PublicJsonResponse } from "../types/publicJsonResponse.js";

export const getCountryByCode = (data: PublicJsonResponse, code: string): Country | undefined => {
	return data.countries.find(c => c.code.toLowerCase() === code.toLowerCase());
};

export const getCountryByIso = (data: PublicJsonResponse, iso: string): Country | undefined => {
	return data.countries.find(c => c.iso_a3.toLowerCase() === iso.toLowerCase());
};

export const getCountriesByStatus = (data: PublicJsonResponse, status: CountryStatus): Country[] => {
	return data.countries.filter(c => c.status === status);
};

export const getCountriesByTrend = (data: PublicJsonResponse, trend: Trend): Country[] => {
	return data.countries.filter(c => c.trend === trend);
};

export const searchCountriesByName = (data: PublicJsonResponse, name: string): Country[] => {
	const lower = name.toLowerCase();
	return data.countries.filter(c => c.name.toLowerCase().includes(lower));
};
