export interface Meta {
	tier: string;
	delay: string;
	generated_at: string;
	license: string;
	attribution: string;
	docs: string;
}

export interface Stats {
	confirmed_active: number;
	suspected: number;
	historical: number;
	deaths_total: number;
	countries_tracked: number;
}

export type CountryStatus =
	| "active"
	| "suspected"
	| "lockdown"
	| "historical";

export type Trend =
	| "up"
	| "down"
	| "flat";

export interface Country {
	iso_a3: string;
	code: string;
	name: string;
	status: CountryStatus;
	active: number;
	suspected: number;
	historical: number;
	deaths: number;
	trend: Trend;
	note: string | null;
}

export type MarkerCategory =
	| "active"
	| "suspected"
	| "lockdown"
	| "historical";

export interface MapMarker {
	id: string;
	country_iso_a3: string;
	city: string;
	lat: number;
	lng: number;
	category: MarkerCategory;
	strain: string;
	cases: number;
	label: string;
	ts: string;
}

export type BriefTag =
	| "update"
	| "confirmed"
	| "resolved";

export interface Brief {
	ts: string;
	tag: BriefTag;
	source: string;
	title: string;
	url: string | null;
	country_iso_a3: string | null;
}

export type OutbreakStatus =
	| "active"
	| "resolved";

export interface Outbreak {
	slug: string;
	name: string;
	strain: string;
	origin: string;
	onset: string;
	status: OutbreakStatus;
	cases: number;
	deaths: number;
	countries: number;
	summary: string;
}