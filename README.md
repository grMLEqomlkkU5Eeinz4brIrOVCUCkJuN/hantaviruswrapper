# hantaviruswrapper

A TypeScript wrapper for the [hantaOSINT](https://hantaosint.com) API, an open-source intelligence feed that tracks hantavirus outbreaks worldwide.

This wrapper only covers the **free tier**. Right now, the only free route is:

```text
GET /api/v1/public.json
```

> `public.json` is refreshed **once per day** by hantaOSINT. Fetching it more often just returns the same data, so you should cache it (see [Caching](#caching)).

## Install

```bash
npm install hantaviruswrapper
```

## Quick start

```ts
import {
  getPublicResponseInfo,
  getCountriesByStatus,
  getOutbreaksByStrain,
} from "hantaviruswrapper";

const data = await getPublicResponseInfo();

const activeCountries = getCountriesByStatus(data, "active");
const hanSeoulOutbreaks = getOutbreaksByStrain(data, "Seoul");
```

## API

### Fetching data

#### `getPublicResponseInfo()`

Fetches `GET /api/v1/public.json` and returns a typed `PublicJsonResponse`:

| Field | Type | Description |
| --- | --- | --- |
| `meta` | `Meta` | Tier, license, generation time |
| `stats` | `Stats` | Global case/death counts |
| `countries` | `Country[]` | Per-country breakdown |
| `map_markers` | `MapMarker[]` | Geolocated case markers |
| `briefs` | `Brief[]` | Recent situation updates |
| `outbreaks` | `Outbreak[]` | Named outbreak summaries |

### Country filters

Every filter takes a `PublicJsonResponse` as its first argument. Fetch once, filter as many times as you want.

| Function | Signature | Description |
| --- | --- | --- |
| `getCountryByCode` | `(data, code: string) => Country \| undefined` | Exact match by country code (case-insensitive) |
| `getCountryByIso` | `(data, iso: string) => Country \| undefined` | Exact match by ISO alpha-3 (case-insensitive) |
| `getCountriesByStatus` | `(data, status: CountryStatus) => Country[]` | `"active"`, `"suspected"`, `"lockdown"`, `"historical"` |
| `getCountriesByTrend` | `(data, trend: Trend) => Country[]` | `"up"`, `"down"`, `"flat"` |
| `searchCountriesByName` | `(data, name: string) => Country[]` | Partial name search (case-insensitive) |

### Outbreak filters

| Function | Signature | Description |
| --- | --- | --- |
| `getOutbreakBySlug` | `(data, slug: string) => Outbreak \| undefined` | Exact match by slug |
| `getOutbreaksByStatus` | `(data, status: OutbreakStatus) => Outbreak[]` | `"active"`, `"resolved"` |
| `getOutbreaksByStrain` | `(data, strain: string) => Outbreak[]` | Partial strain search (case-insensitive) |
| `searchOutbreaksByName` | `(data, name: string) => Outbreak[]` | Partial name search (case-insensitive) |
| `getOutbreaksByOrigin` | `(data, origin: string) => Outbreak[]` | Partial origin search (case-insensitive) |

## Caching

Since `public.json` only updates daily, you really don't need to fetch it every time. `createCachedFetcher` gives you a simple in-memory cache with a TTL you set:

```ts
import { createCachedFetcher, getCountriesByStatus } from "hantaviruswrapper";

// cache for 1 hour (the data only changes daily anyway)
const fetchData = createCachedFetcher(3_600_000);

const data = await fetchData(); // hits the API
const data2 = await fetchData(); // returns cached, no request

const active = getCountriesByStatus(data2, "active");
```

Default TTL is 5 minutes. You can force a refresh whenever:

```ts
fetchData.invalidate();
const fresh = await fetchData(); // hits the API again
```

You're also free to manage your own cache. Every filter function just takes a `PublicJsonResponse`, so pass in whatever you have.

## Rate limiting

The free tier has these limits:

| Tier | Limit | Burst | On exceed |
| --- | --- | --- | --- |
| Free | 60 / minute | 120 | HTTP 429 |

The wrapper includes a client-side token-bucket rate limiter that stops you from sending requests that would get rejected. It's built into the client, so you don't need to set anything up.

If a request would go over the limit, a `RateLimitError` is thrown before the request goes out:

```ts
import { RateLimitError, rateLimiter } from "hantaviruswrapper";

// check first
if (rateLimiter.canRequest()) {
  const data = await getPublicResponseInfo();
}

// or catch it
try {
  const data = await getPublicResponseInfo();
} catch (e) {
  if (e instanceof RateLimitError) {
    console.log(`Retry after ${e.retryAfterMs}ms`);
  }
}
```

If you're caching (and you should be), you'll probably never hit this.

## Types

All types are exported:

```ts
import type {
  PublicJsonResponse,
  Meta,
  Stats,
  Country,
  CountryStatus,
  Trend,
  MapMarker,
  MarkerCategory,
  Brief,
  BriefTag,
  Outbreak,
  OutbreakStatus,
} from "hantaviruswrapper";
```

## About hantaOSINT

[hantaOSINT](https://hantaosint.com) tracks hantavirus activity globally. The API has free and paid tiers. This wrapper only covers the free routes.

Right now the only active free route is `GET /api/v1/public.json`. If more free endpoints get added, this wrapper will be updated to support them.

## License

ISC
