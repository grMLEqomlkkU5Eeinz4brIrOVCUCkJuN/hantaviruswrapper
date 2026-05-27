import { Outbreak, OutbreakStatus } from "../types/BaseResponse.js";
import { PublicJsonResponse } from "../types/publicJsonResponse.js";

export const getOutbreakBySlug = (data: PublicJsonResponse, slug: string): Outbreak | undefined => {
	return data.outbreaks.find(o => o.slug === slug);
};

export const getOutbreaksByStatus = (data: PublicJsonResponse, status: OutbreakStatus): Outbreak[] => {
	return data.outbreaks.filter(o => o.status === status);
};

export const getOutbreaksByStrain = (data: PublicJsonResponse, strain: string): Outbreak[] => {
	const lower = strain.toLowerCase();
	return data.outbreaks.filter(o => o.strain.toLowerCase().includes(lower));
};

export const searchOutbreaksByName = (data: PublicJsonResponse, name: string): Outbreak[] => {
	const lower = name.toLowerCase();
	return data.outbreaks.filter(o => o.name.toLowerCase().includes(lower));
};

export const getOutbreaksByOrigin = (data: PublicJsonResponse, origin: string): Outbreak[] => {
	const lower = origin.toLowerCase();
	return data.outbreaks.filter(o => o.origin.toLowerCase().includes(lower));
};
