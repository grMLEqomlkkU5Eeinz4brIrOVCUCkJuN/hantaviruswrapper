import {Meta, Stats, Country, MapMarker, Brief, Outbreak} from "../types/BaseResponse.js";

export interface PublicJsonResponse {
	meta: Meta;
	stats: Stats;
	countries: Country[];
	map_markers: MapMarker[];
	briefs: Brief[];
	outbreaks: Outbreak[];
}
