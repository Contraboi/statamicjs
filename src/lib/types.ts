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

export interface Form<TFields extends Record<string, FormField>> {
  handle: string;
  title: string;
  api_url: string;
  fields: TFields;
}

type FormFieldVisibility = "visible" | "hidden" | "computed" | "read_only";
type FormFieldInstructionsPosition = "above" | "below";
type FormFieldListable = "visible" | "hidden" | "not_listable";

export interface DefaultFormField {
  type:
    | "text"
    | "textarea"
    | "checkboxes"
    | "radio"
    | "toggle"
    | "assets"
    | "integer"
    | "spacer";
  handle: string;
  antlers: boolean;
  display: string;
  localizable: boolean;
  listable: FormFieldListable;
  instructions_position: FormFieldInstructionsPosition;
  visibility: FormFieldVisibility;
  replicator_preview: boolean;
  hide_display: boolean;
  width: number;
  validate?: string[];
  icon?: string;
  instructions?: string;
}

export interface FormTextField extends DefaultFormField {
  type: "text";
  input_type:
    | "text"
    | "color"
    | "date"
    | "email"
    | "hidden"
    | "month"
    | "number"
    | "password"
    | "tel"
    | "time"
    | "url"
    | "week";
  placeholder?: string;
  character_limit?: number;
  autocomplete?: string;
  prepend?: string;
  append?: string;
}

export interface FormTextareaField extends DefaultFormField {
  type: "textarea";
  character_limit?: number;
  autocomplete?: string;
  prepend?: string;
  append?: string;
}

export interface FormCheckboxField extends DefaultFormField {
  type: "checkboxes";
  inline: boolean;
  options?: Record<string, string | null>;
}

export interface FormRadioField extends DefaultFormField {
  type: "radio";
  inline: boolean;
  options?: Record<string, string | null>;
}

export interface FormToggleField extends DefaultFormField {
  type: "toggle";
  default: boolean;
}

export interface FormAssetsField extends DefaultFormField {
  type: "assets";
  mode: "list" | "grid";
  container: string;
  restrict: boolean;
  allow_uploads: boolean;
  show_filename: boolean;
  show_set_alt: boolean;
  min_files?: number;
  max_files?: number;
  folder?: string;
}

export interface FormIntegerField extends DefaultFormField {
  type: "integer";
  prepend?: string;
  append?: string;
  default?: string;
}

export interface FormSpacerField extends DefaultFormField {
  type: "spacer";
}

export type FormField =
  | FormTextField
  | FormTextareaField
  | FormCheckboxField
  | FormRadioField
  | FormToggleField
  | FormAssetsField
  | FormIntegerField
  | FormSpacerField;

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

export type StatamicFormUtility<
  TBlueprint extends Record<string, FormField>,
  TForm,
> = {
  getAll: () => Promise<{ data: Form<TBlueprint>[] } | undefined>;
  get: (id: TForm) => Promise<{ data: Form<TBlueprint> } | undefined>;
};

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
  TForm extends string | undefined,
>({
  baseUrl,
  collections,
  navigations,
  taxonomies,
  globals,
  forms,
  sites,
}: {
  baseUrl: string;
  collections?: TCollection[];
  navigations?: TNavigation[];
  taxonomies?: TTaxonomy[];
  globals?: TGlobal[];
  forms?: TForm[];
  sites?: TSite[];
}) => Prettify<
  Omit<
    StatamicCreatorReturnType<
      TCollection,
      TTaxonomy,
      TGlobal,
      TNavigation,
      TForm,
      TSite
    >,
    GetUndefinedKeys<
      StatamicCreatorReturnType<
        TCollection,
        TTaxonomy,
        TGlobal,
        TNavigation,
        TForm,
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
  TForm,
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
  form: IncludesUndefined<TForm[]> extends true
    ? undefined
    : <TBlueprint extends Record<string, FormField>>() => StatamicFormUtility<
        TBlueprint,
        TForm
      >;
};
