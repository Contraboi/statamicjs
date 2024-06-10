import type {
  StatamicCreatorReturnType,
  StatamicCacheCreator,
  StatamicCacheReturnType,
  Collection,
  StatamicData,
  Taxonomy,
  Global,
  FormField,
  Form,
  Navigation,
} from "./types";

type GenericStatamic = StatamicCreatorReturnType<
  string,
  string,
  string,
  string,
  string,
  string
>;

type CacheReturn<T> = StatamicCacheReturnType<
  string,
  string,
  string,
  string,
  string,
  T
>;

export async function createStatamicCache<T>({
  statamic: s,
  expires = 0,
}: {
  statamic: T;
  expires?: number;
}): Promise<StatamicCacheCreator<T>> {
  const statamic = s as GenericStatamic;
  const cache = statamic.meta.sites
    ? await createLocalizedCache(statamic)
    : await createCache(statamic);

  return cache as any;
}

async function createCache(statamic: GenericStatamic) {
  let cache = {} as CacheReturn<undefined>;

  if (statamic.meta.collections) {
    const map = new Map<string, StatamicData<Collection>>();

    for (const collection of statamic.meta.collections) {
      const data = await statamic
        .collection<Collection>(collection)
        .limit(Number.MAX_SAFE_INTEGER)
        .get();

      if (!data) {
        console.error(`Collection ${collection} not found`);
        continue;
      }

      map.set(collection, data);
    }

    cache["collection"] = map;
  }

  if (statamic.meta.taxonomies) {
    const map = new Map<string, StatamicData<Taxonomy>>();

    for (const taxonomy of statamic.meta.taxonomies) {
      const data = await statamic.taxonomy<Taxonomy>(taxonomy).get();

      if (!data) {
        console.error(`Taxonomy ${taxonomy} not found`);
        continue;
      }

      map.set(taxonomy, data);
    }

    cache["taxonomy"] = map;
  }

  if (statamic.meta.globals) {
    const map = new Map<string, StatamicData<Global>>();

    for (const global of statamic.meta.globals) {
      const data = await statamic.global<Global>(global).get();

      if (!data) {
        console.error(`Global ${global} not found`);
        continue;
      }

      map.set(global, data);
    }

    cache.global = map;
  }

  if (statamic.meta.forms) {
    const map = new Map<string, Form<Record<string, FormField>>>();

    for (const form of statamic.meta.forms) {
      const data = await statamic.form().get(form);

      if (!data) {
        console.error(`Form ${form} not found`);
        continue;
      }

      map.set(form, data.data);
    }

    cache.form = map;
  }

  if (statamic.meta.navigations) {
    const map = new Map<string, StatamicData<Navigation>>();

    for (const navigation of statamic.meta.navigations) {
      const data = await statamic.navigation<Navigation>(navigation).get();

      if (!data) {
        console.error(`Navigation ${navigation} not found`);
        continue;
      }

      map.set(navigation, data);
    }

    cache["navigation"] = map;
  }

  return cache;
}

async function createLocalizedCache(statamic: GenericStatamic) {
  let cache = {} as CacheReturn<string>;

  for (const site of statamic.meta.sites) {
    cache[site] = {} as CacheReturn<undefined>;

    if (statamic.meta.collections) {
      const map = new Map<string, StatamicData<Collection>>();

      for (const collection of statamic.meta.collections) {
        const data = await statamic
          .collection<Collection>(collection)
          .site(site)
          .limit(Number.MAX_SAFE_INTEGER)
          .get();

        if (!data) {
          console.error(`Collection ${collection} not found`);
          continue;
        }

        map.set(collection, data);
      }

      cache[site]["collection"] = map;
    }

    if (statamic.meta.taxonomies) {
      const map = new Map<string, StatamicData<Taxonomy>>();

      for (const taxonomy of statamic.meta.taxonomies) {
        const data = await statamic
          .taxonomy<Taxonomy>(taxonomy)
          .site(site)
          .get();

        if (!data) {
          console.error(`Taxonomy ${taxonomy} not found`);
          continue;
        }

        map.set(taxonomy, data);
      }

      cache[site]["taxonomy"] = map;
    }

    if (statamic.meta.globals) {
      const map = new Map<string, StatamicData<Global>>();

      for (const global of statamic.meta.globals) {
        const data = await statamic.global<Global>(global).site(site).get();

        if (!data) {
          console.error(`Global ${global} not found`);
          continue;
        }

        map.set(global, data);
      }

      cache[site].global = map;
    }

    if (statamic.meta.forms) {
      const map = new Map<string, Form<Record<string, FormField>>>();

      for (const form of statamic.meta.forms) {
        const data = await statamic.form().get(form);

        if (!data) {
          console.error(`Form ${form} not found`);
          continue;
        }

        map.set(form, data.data);
      }

      cache[site].form = map;
    }

    if (statamic.meta.navigations) {
      const map = new Map<string, StatamicData<Navigation>>();

      for (const navigation of statamic.meta.navigations) {
        const data = await statamic
          .navigation<Navigation>(navigation)
          .site(site)
          .get();

        if (!data) {
          console.error(`Navigation ${navigation} not found`);
          continue;
        }

        map.set(navigation, data);
      }

      cache[site]["navigation"] = map;
    }
  }

  return cache;
}
