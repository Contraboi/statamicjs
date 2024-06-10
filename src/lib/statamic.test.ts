import { createStatamic } from "./statamic";
import { createStatamicCache } from "./cache";
import { Collection, Global, StatamicData } from "./types";
const collections = ["info_pages"] as const;

const navigations = [
  "header",
  "upper_header",
  "mobile_app_navigation",
  "mobile_app_bottom_bar",
  "footer",
  "footer_socials",
] as const;

const globals = [
  "static_strings",
  "static_string_groups",
  "footer_image",
  "job_redirects",
  "redirects",
  "config",
  "homepage_banners",
  "job_banners",
  "static_page_seo",
  "default_seo_image",
] as const;

const statamic = createStatamic({
  baseUrl: "https://mjob-statamic.osc-fr1.scalingo.io/api",
  globals,
  sites: ["rs", "si"],
});

export const statamicCache = await createStatamicCache({
  statamic,
});

type StaticString = Global & {
  staticString: any[];
};
const paths =
  statamicCache.si.global.get<StatamicData<StaticString>>("static_strings");
console.log(paths?.data.staticString);
