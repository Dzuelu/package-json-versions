export interface ICache<T, K> {
  clear: () => void;
  get: (key: K) => Promise<T>;
}

type FetchFunction<T, K> = (key: K) => Promise<T>;

export const buildCache = <T, K>(fetchFn: FetchFunction<T, K>): ICache<T, K> => {
  const cache: Map<string, T> = new Map();

  return {
    clear: () => cache.clear(),
    get: async key => {
      const sanitized = JSON.stringify(key);
      if (!cache.has(sanitized)) {
        const value = await fetchFn(key);
        cache.set(sanitized, value);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return cache.get(sanitized)!;
    }
  };
};
