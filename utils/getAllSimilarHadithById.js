import * as cache from './cache.js';

export const getAllSimilarHadithById = async (hadithId) => {
  const url = `https://dorar-hadith-api.cyclic.cloud/v1/site/hadith/similar/${hadithId}`;

  const result = await cache.get(url);
  if (result) return result;

  const res = await fetch(encodeURI(url));
  const { data } = await res.json();

  cache.set(url, data);
  return data;
};
