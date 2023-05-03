import { convertOptionsToQueryString } from './adapters/convertOptionsToQueryString.js';
import { bukhariOptions } from './options/bukhariOptions.js';
import { muslimOptions } from './options/muslimOptions.js';
import * as cache from './cache.js';

export const getHadith = async (
  text = '',
  page = 1,
  query = '',
  tabId = 'main-tab',
) => {
  if (tabId === 'bukhari-tab')
    query = convertOptionsToQueryString(bukhariOptions);
  else if (tabId === 'muslim-tab')
    query = convertOptionsToQueryString(muslimOptions);

  const url = `https://dorar-hadith-api.cyclic.app/v1/site/hadith/search?value=${text}&page=${page}&${query}`;

  const result = await cache.get(url);
  if (result) return result;

  const res = await fetch(encodeURI(url));
  const { data } = await res.json();

  cache.set(url, data);
  return data;
};
