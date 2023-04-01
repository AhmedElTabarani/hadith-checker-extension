import { searchForHadith } from './searchForHadith.js';
import { convertHTMLHadithToJSON } from './convertHTMLHadithToJSON.js';
import { convertOptionsToQueryString } from './convertOptionsToQueryString.js';
import { bukhariOptions, muslimOptions } from './defaultOptions.js';

export const getHadith = async (
  query = '',
  text = '',
  page = 1,
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
