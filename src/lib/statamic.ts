import camelcaseKeys from "camelcase-keys";
import {
  FormField,
  StatamicCreator,
  StatamicData,
  StatamicFormUtility,
  StatamicUtility,
} from "./types";

const convertFromCamelCaseToSnakeCase = (value: string) => {
  return value.replace(/([A-Z])/g, "_$1").toLowerCase();
};

async function fetcher<T>(query: string): Promise<T | undefined> {
  try {
    // Prints the request to the console with purple color
    //\x1b[35m" is the color code for purple
    //\x1b[34m" is the color code for blue
    //\x1b[0m" is the color code for reset
    console.log("\x1b[35m", "Statamic Request: ", "\x1b[34m", query, "\x1b[0m");
    const response = await fetch(query);

    const data = await response.json();

    if (!data) {
      console.error("No data found");
      return;
    }

    return camelcaseKeys(data, { deep: true });
  } catch (e) {
    console.error(e);
  }
}

const createStatamicUtility = <
  TBlueprint extends object,
  TUtility extends string,
  TTaxonomy extends string,
  TSite extends string,
>(
  query: string,
): StatamicUtility<TBlueprint, TUtility, TSite, TTaxonomy> => {
  const buildString = (
    value: keyof TBlueprint | string | Array<keyof TBlueprint | string>,
  ) => {
    let valueString = typeof value === "string" ? value : "";
    if (Array.isArray(value)) valueString = value.join(",");

    return convertFromCamelCaseToSnakeCase(valueString);
  };

  return {
    get: () => fetcher<StatamicData<TBlueprint>>(query),
    filter: (by, condition, value) => {
      query += `filter[${buildString(by)}:${condition}]=${value}&`;
      return createStatamicUtility(query);
    },
    filterByTaxonomy: (taxonomy, condition, value) => {
      query += `filter[taxonomy:${taxonomy}:${condition}]=${buildString(value)}&`;
      return createStatamicUtility(query);
    },
    site: (locale) => {
      const isDifferentParam =
        query.includes("navs") || query.includes("globals");
      isDifferentParam
        ? (query += `site=${locale}&`)
        : (query += `filter[site]=${locale}&`);
      return createStatamicUtility(query);
    },
    limit: (limit) => {
      query += `limit=${limit}&`;
      return createStatamicUtility(query);
    },
    sort: (by, reverse = false) => {
      query += `sort=${reverse ? "-" : ""}${buildString(by)}&`;
      return createStatamicUtility(query);
    },
    selectFields: (fields) => {
      query += `fields=${buildString(fields)}&`;
      return createStatamicUtility(query);
    },
    paginate: (page, limit) => {
      query += `limit=${limit}&page=${page}&`;
      return createStatamicUtility(query);
    },
  };
};

const createStatamicFormUtility = <
  TBlueprint extends Record<string, FormField>,
  TForm extends string,
>(
  query: string,
): StatamicFormUtility<TBlueprint, TForm> => {
  return {
    getAll: () => fetcher(query),
    get: async (id) => fetcher(`${query}/${id}`),
  };
};

/**
 * @param baseUrl - The base URL of the Statamic API.
 * @param collections - All collections handles in the Statamic CMS.
 * @param taxonomies - All taxonomies handles in the Statamic CMS.
 * @param globals - All globals handles in the Statamic CMS.
 * @param sites - Different locales that are available.
 * @param navigations - All navigations handle that are created in Statamic CMS.
 *
 * @example
 * const statamic = createStatamic({
 *    collections: ["blog", "pages"],
 taxonomies: ["tags", "categories"],
 globals: ["site"],
 *    sites: ["en", "fr"],
 *    navigations: ["main"],
 *    baseUrl: "https://example.com/api",
 * });
 *
 const blogsWithHelloTitle = await statamic.collection<Collection>("blog").filter("title", "is", "hello").get();
 */
export const createStatamic: StatamicCreator = ({
  baseUrl,
  collections,
  taxonomies,
  globals,
  forms,
  navigations,
  sites,
}) => {
  let query: string = "";

  if (!baseUrl) {
    throw new Error("baseUrl is required");
  }
  if (baseUrl[baseUrl.length - 1] === "/") {
    throw new Error("baseUrl should not end with a slash (/)");
  }

  let obj = {
    collection: !collections
      ? undefined
      : (collection: (typeof collections)[number]) => {
          query = `${baseUrl}/collections/${collection}/entries?`;
          return createStatamicUtility(query);
        },
    taxonomy: !taxonomies
      ? undefined
      : (taxonomy: (typeof taxonomies)[number]) => {
          query = `${baseUrl}/taxonomies/${taxonomy}/terms?`;
          return createStatamicUtility(query);
        },
    global: !globals
      ? undefined
      : (global: (typeof globals)[number]) => {
          query = `${baseUrl}/globals/${global}?`;
          return createStatamicUtility(query);
        },
    navigation: !navigations
      ? undefined
      : (navigation: (typeof navigations)[number]) => {
          query = `${baseUrl}/navs/${navigation}/tree?`;
          return createStatamicUtility(query);
        },
    form: !forms
      ? undefined
      : () => {
          query = `${baseUrl}/forms`;
          return createStatamicFormUtility(query);
        },
    meta: {
      collections,
      taxonomies,
      globals,
      sites,
      forms,
      navigations,
    },
  } as any; // TODO: I need to figure out how to type this properly, currently im braindead = @Planer myb you can try it?;

  return obj;
};
/**
 * Array containing filter conditions for data filtering operations.
 *
 * @see https://statamic.dev/conditions#string-conditions
 */
export const filterConditions = [
  /**
   * Include if field is equal to value.
   */
  "is",
  /**
   * Include if field is not equal to value.
   */
  "not",
  /**
   * Include if field contains value.
   */
  "contains",
  /**
   * Include if field exists.
   */
  "exists",
  /**
   * Include if field does not exist.
   */
  "doesnt_exist",
  /**
   * Include if field does not contain value.
   */
  "doesnt_contain",
  /**
   * Include if field value is in the provided array.
   */
  "in",
  /**
   * Include if field value is not in the provided array.
   */
  "not_in",
  /**
   * Include if field value starts with the provided string.
   */
  "starts_with",
  /**
   * Include if field value ends with the provided string.
   */
  "ends_with",
  /**
   * Include if field value does not start with the provided string.
   */
  "doesnt_start_with",
  /**
   * Include if field value does not end with the provided string.
   */
  "doesnt_end_with",
  /**
   * Include if field value is less than the provided value.
   */
  "lt",
  /**
   * Include if field value is greater than the provided value.
   */
  "gt",
  /**
   * Include if field value is less than or equal to the provided value.
   */
  "lte",
  /**
   * Include if field value is greater than or equal to the provided value.
   */
  "gte",
  /**
   * Include if field value matches the provided regular expression.
   */
  "matches",
  /**
   * Include if field value does not match the provided regular expression.
   */
  "doesnt_match",
  /**
   * Include if field value is alphabetic.
   */
  "is_alpha",
  /**
   * Include if field value is numeric.
   */
  "is_numeric",
  /**
   * Include if field value is alphanumeric.
   */
  "is_alpha_numeric",
  /**
   * Include if field value is a URL.
   */
  "is_url",
  /**
   * Include if field value is an email address.
   */
  "is_email",
  /**
   * Include if field value is after the provided date.
   */
  "is_after",
  /**
   * Include if field value is before the provided date.
   */
  "is_before",
  /**
   * Include if field value is number-wang.
   */
  "is_numberwang",
] as const;
