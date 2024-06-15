import handleDorarHadithData from './handleDorarHadithData.js';
import handleSunnahHadithData from './handleSunnahHadithData.js';

export const updateContent = async (allHadith, tabId) => {
  console.log(tabId);
  switch (tabId) {
    case 'main-tab':
    case 'bukhari-tab':
    case 'muslim-tab':
      return handleDorarHadithData(allHadith);
    case 'sunnah-site-tab':
      return handleSunnahHadithData(allHadith);
  }
};
