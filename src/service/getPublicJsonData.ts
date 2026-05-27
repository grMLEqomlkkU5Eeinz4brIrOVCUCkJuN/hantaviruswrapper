import { hantaVirusClient } from "../client.js";
import { PublicJsonResponse } from "../types/publicJsonResponse.js";

export const getPublicResponseInfo = async () => {
	return await hantaVirusClient<PublicJsonResponse>("/public.json");
}