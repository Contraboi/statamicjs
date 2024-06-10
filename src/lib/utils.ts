import { Collection, StatamicData, StatamicPath } from "./types";

export class CacheEntry<K, V> extends Map<K, V> {
  constructor() {
    super();
  }

  get<T extends V>(key: K): T | undefined {
    return super.get(key) as T;
  }

  set(key: K, value: V) {
    return super.set(key, value);
  }
}

export class CollectionCacheEntry<
  K,
  V extends StatamicData<Collection[]>,
> extends CacheEntry<K, V> {
  constructor() {
    super();
  }

  public getAllPaths({
    collections,
    excludeLocale = false,
  }: {
    collections: Array<K>;
    excludeLocale?: boolean;
  }) {
    const allCollections: V[] = [];

    for (const collection of collections) {
      const collectionData = this.get(collection);
      if (!collectionData) continue;

      allCollections.push(collectionData);
    }

    const parentPages = allCollections.flatMap((collection) => {
      return collection?.data.filter((entry) => entry.mount);
    });

    return this.buildPaths(allCollections, parentPages, excludeLocale);
  }

  private buildPaths(
    allCollections: Array<V>,
    parentPages: Collection[],
    excludeLocale: boolean,
  ) {
    let paths: Array<StatamicPath> = [];

    // Here we loop through all collections, and build the path for each entry.
    for (const collection of allCollections) {
      if (!collection) continue;

      // If the collection is not localized, we can just loop through the data and build the path for each entry.
      for (const entry of collection.data) {
        if (!entry) continue;
        paths.push(this.buildPath(entry, parentPages, excludeLocale));
      }
    }

    return paths;
  }

  private buildPath(
    entry: Collection,
    parentPages: Array<Collection>,
    excludeLocale: boolean,
  ) {
    // We want to exclude the locale from the path if it's the main locale.
    const locale = excludeLocale ? undefined : entry.locale;
    const mainSlug = entry.slug;
    let parentSlug: string | undefined = undefined;

    for (const parentPage of parentPages) {
      if (parentPage?.mount?.handle === entry.collection.handle) {
        parentSlug = parentPage.slug;
      }
    }

    return {
      locale,
      mainSlug,
      parentSlug,
      slug: this.buildSlug(locale, parentSlug, mainSlug),
    };
  }

  private buildSlug(
    locale: string | undefined,
    parentSlug: string | undefined,
    slug: string,
  ) {
    if (parentSlug) slug = `${parentSlug}/${slug}`;
    if (locale) slug = `${locale}/${slug}`;

    return `/${slug}`;
  }
}
