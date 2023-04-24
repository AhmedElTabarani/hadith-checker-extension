import * as cache from './cache.js';

export const getSharhById = async (sharhId) => {
  const url = `https://dorar-hadith-api.cyclic.app/site/oneSharhBy?id=${sharhId}`;

  const result = await cache.get(url);
  if (result) return result;

  const res = await fetch(encodeURI(url));
  const data = await res.json();

  cache.set(url, data);
  return data;
};
