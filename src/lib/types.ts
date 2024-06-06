import { filterConditions } from "./statamic";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type GetUndefinedKeys<T> = {
  [K in keyof T]: T[K] extends undefined ? K : never;
}[keyof T];

export type StatamicData<T> = {
  data: T;
  meta: MetaData;
  links: {
    first: string;
    last: string;
    prev: string | null;
  };
};

export type MetaData = {
  currentPage: number;
  from: number;
  lastPage: number;
  links: {
    url: string;
    label: number;
    active: boolean;
  }[];
  path: string;
  perPage: number;
  to: number;
  total: number;
};

export interface Collection {
  amp_url?: string;
  api_url: string;
  blueprint: Entry;
  collection: Entry;
  date: string;
  edit_url: string;
  id: string;
  indexed: boolean;
  is_entry: boolean;
  last_modified: string;
  locale: string;
  mount?: Entry;
  order: any;
  origin_id: any;
  permalink: any;
  private: boolean;
  published: boolean;
  slug: string;
  status: string;
  title: string;
  updated_at: string;
  updated_by: UpdatedBy;
  uri?: string;
  url?: string;
}

export interface Entry {
  title: string;
  handle: string;
}

export interface UpdatedBy {
  id: string;
  name: string;
  email: string;
  api_url: string;
}

export interface Navigation {
  page: Page;
  depth: number;
  children: Navigation[];
}

export interface Page {
  entryId: string;
  id: string;
  permalink: string;
  title: string;
  uri: string;
  url: string;
}

export interface TaxonomyEntry {
  title: string;
  handle: string;
  uri: string;
  url: string;
  permalink: string;
}

export interface Taxonomy {
  api_url: string;
  blueprint: Entry;
  edit_url: string;
  entries_count: number;
  id: string;
  is_term: boolean;
  locale: string;
  permalink: string;
  slug: string;
  taxonomy: TaxonomyEntry;
  title: string;
  updated_at: string;
  updated_by: UpdatedBy;
  uri: string;
  url: string;
}

export interface Global {
  api_url: string;
  handle: string;
}

type SnakeCase<S extends string> = S extends `${infer S1}${infer S2}`
  ? S2 extends Uncapitalize<S2>
    ? `${Uncapitalize<S1>}${SnakeCase<S2>}`
    : `${Uncapitalize<S1>}_${SnakeCase<S2>}`
  : S;

type FilterCondition = (typeof filterConditions)[number];

export type StatamicUtility<
  TBlueprint,
  TUtility,
  TTaxonomy,
  TSite,
  TOmittedFunctions extends keyof StatamicUtility<
    TBlueprint,
    TUtility,
    TTaxonomy,
    TSite
  > = never,
> = {
  filter: (
    by: TBlueprint extends Array<unknown>
      ? SnakeCase<keyof TBlueprint[number] & string>
      : SnakeCase<keyof TBlueprint & string>,
    condition: FilterCondition,
    value: string,
  ) => Prettify<
    Prettify<
      Omit<
        StatamicUtility<
          TBlueprint,
          TUtility,
          TTaxonomy,
          TSite,
          TOmittedFunctions
        >,
        TOmittedFunctions
      >
    >
  >;
  filterByTaxonomy: (
    taxonomy: TTaxonomy,
    condition: FilterCondition,
    value: string | Array<string>,
  ) => Prettify<
    Omit<
      StatamicUtility<
        TBlueprint,
        TUtility,
        TTaxonomy,
        TSite,
        TOmittedFunctions
      >,
      TOmittedFunctions
    >
  >;
  site: (
    locale: TSite,
  ) => Prettify<
    Omit<
      StatamicUtility<
        TBlueprint,
        TUtility,
        TTaxonomy,
        TSite,
        TOmittedFunctions | "site"
      >,
      TOmittedFunctions | "site"
    >
  >;
  limit: (
    limit: number,
  ) => Prettify<
    Omit<
      StatamicUtility<
        TBlueprint,
        TUtility,
        TTaxonomy,
        TSite,
        TOmittedFunctions | "limit"
      >,
      TOmittedFunctions | "limit"
    >
  >;
  sort: (
    by: keyof TBlueprint | Array<keyof TBlueprint>,
    reverse?: boolean,
  ) => Prettify<
    Omit<
      StatamicUtility<
        TBlueprint,
        TUtility,
        TTaxonomy,
        TSite,
        TOmittedFunctions | "sort"
      >,
      TOmittedFunctions | "sort"
    >
  >;
  selectFields: (
    fields: keyof TBlueprint | Array<keyof TBlueprint>,
  ) => Prettify<
    Omit<
      StatamicUtility<
        TBlueprint,
        TUtility,
        TTaxonomy,
        TSite,
        TOmittedFunctions | "selectFields"
      >,
      TOmittedFunctions | "selectFields"
    >
  >;
  paginate: (
    page: number,
    limit: number,
  ) => Prettify<
    Omit<
      StatamicUtility<
        TBlueprint,
        TUtility,
        TTaxonomy,
        TSite,
        TOmittedFunctions | "paginate" | "limit"
      >,
      TOmittedFunctions | "paginate" | "limit"
    >
  >;
  get: () => Promise<StatamicData<TBlueprint> | undefined>;
};

type IncludesUndefined<T> = T extends (infer U)[]
  ? undefined extends U
    ? true
    : false
  : false;

export type StatamicCreator = <
  TCollection extends string | undefined,
  TNavigation extends string | undefined,
  TTaxonomy extends string | undefined,
  TGlobal extends string | undefined,
  TSite extends string | undefined,
>({
  baseUrl,
  collections,
  navigations,
  taxonomies,
  globals,
  sites,
}: {
  baseUrl: string;
  collections?: TCollection[];
  navigations?: TNavigation[];
  taxonomies?: TTaxonomy[];
  globals?: TGlobal[];
  sites?: TSite[];
}) => Prettify<
  Omit<
    StatamicCreatorReturnType<
      TCollection,
      TTaxonomy,
      TGlobal,
      TNavigation,
      TSite
    >,
    GetUndefinedKeys<
      StatamicCreatorReturnType<
        TCollection,
        TTaxonomy,
        TGlobal,
        TNavigation,
        TSite
      >
    >
  >
>;

type StatamicCreatorReturnType<
  TCollection,
  TTaxonomy,
  TGlobal,
  TNavigation,
  TSite,
> = {
  collection: IncludesUndefined<TCollection[]> extends true
    ? undefined
    : <TBlueprint extends object>(
        collection: TCollection,
      ) => StatamicUtility<TBlueprint, TCollection, TTaxonomy, TSite>;
  taxonomy: IncludesUndefined<TTaxonomy[]> extends true
    ? undefined
    : <TBlueprint extends object>(
        taxonomy: TTaxonomy,
      ) => StatamicUtility<TBlueprint, TGlobal, TTaxonomy, TSite>;
  global: IncludesUndefined<TGlobal[]> extends true
    ? undefined
    : <TBlueprint extends object>(
        global: TGlobal,
      ) => StatamicUtility<TBlueprint, TGlobal, TTaxonomy, TSite>;
  navigation: IncludesUndefined<TNavigation[]> extends true
    ? undefined
    : <TBlueprint extends object>(
        navigation: TNavigation,
      ) => StatamicUtility<TBlueprint, TNavigation, TTaxonomy, TSite>;
};
