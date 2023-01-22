export interface ICache<T> {
  clear: () => void;
  get: (key: string) => Promise<T>;
}

type FetchFunction<T> = (key: string) => Promise<T>;

export const buildCache = <T>(fetchFn: FetchFunction<T>): ICache<T> => {
  const cache: Map<string, T> = new Map();

  return {
    clear: () => cache.clear(),
    get: async key => {
      if (!cache.has(key)) {
        const value = await fetchFn(key);
        cache.set(key, value);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return cache.get(key)!;
    }
  };
};
