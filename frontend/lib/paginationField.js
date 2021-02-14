import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    // tells apollo that we are in charge.
    keyArgs: false,
    // apollo first tries to read items.
    // we can either return the cached items, or we can return false, so apollo makes a network request.
    read(existingItems = [], { args, cache }) {
      const { skip, first } = args;
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existingItems.slice(skip, skip + first).filter((x) => x);

      // if there are items, and there aren't enough items to satisfy how many we requested,
      // and we are on the last page. Then just return the last items.
      if (items.length && items.length !== first && page === pages)
        return items;

      if (items.length !== first) return false;

      if (items.length) return items;

      return false;
    },
    // cache the newly fetched data.
    merge(existing, incoming, { args }) {
      const { skip, first } = args;

      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
    // then go back and read the cache.
  };
}
