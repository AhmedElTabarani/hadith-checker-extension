import { searchForHadith } from './searchForHadith.js';
import { convertHTMLHadithToJSON } from './adapters/convertHTMLHadithToJSON.js';
import { convertOptionsToQueryString } from './adapters/convertOptionsToQueryString.js';
import { bukhariOptions } from './options/bukhariOptions.js';
import { muslimOptions } from './options/muslimOptions.js';

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

  const html = await searchForHadith(text, page, query);
  const data = convertHTMLHadithToJSON(html);
  return data;
};
