import { createStatamic } from "./statamic";

const statamic = createStatamic({
  baseUrl: "https://statamic.test",
  collections: ["blog"],
  globals: ["footer"],
  navigations: ["main"],
  forms: ["contact"],
});
