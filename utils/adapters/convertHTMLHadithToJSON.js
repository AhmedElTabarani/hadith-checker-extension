import {
  getAllHadith,
  getAllHadithInfo,
} from '../extractHadithInfo.js';

export const convertHTMLHadithToJSON = (html) => {
  try {
    const allHadith = getAllHadith(html);
    const allHadithInfo = getAllHadithInfo(html);

    const result = allHadith.map((hadith, index) => {
      return {
        ...hadith,
        ...allHadithInfo[index],
      };
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};
