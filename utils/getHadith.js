import queryOptions from '../controllers/queryOptions.controller.js';
import * as cache from './cache.js';

export const getHadith = async (
  text = '',
  page = 1,
  tabId = 'main-tab',
) => {
  const query = queryOptions.convertOptionsToQueryString(tabId);

  const url = `https://dorar-hadith-api.cyclic.app/v1/site/hadith/search?value=${text}&page=${page}&${query}`;

  const result = await cache.get(url);
  if (result) return result;

  const res = await fetch(encodeURI(url));
  const data = await res.json();

  cache.set(url, data);
  return data;
};
