import { config } from "@repo/config";
import { getBaseUrl } from "@repo/utils";
import {} from "content-collections";
import type { MetadataRoute } from "next";

const baseUrl = getBaseUrl();
const locales = config.i18n.enabled
	? Object.keys(config.i18n.locales)
	: [config.i18n.defaultLocale];

const staticMarketingPages = ["", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...staticMarketingPages.flatMap((page) =>
			locales.map((locale) => ({
				url: new URL(`/${locale}${page}`, baseUrl).href,
				lastModified: new Date(),
			})),
		),
	];
}
