class ExtractorHelper {
  getMohdithId = (info) => {
    return info
      .querySelector('a[view-card="mhd"]')
      ?.getAttribute('card-link')
      ?.match(/\d+/)[0];
  };

  getBookId = (info) => {
    return info
      .querySelector('a[view-card="book"]')
      ?.getAttribute('card-link')
      ?.match(/\d+/)[0];
  };

  getSharhId = (info) => {
    return info.querySelector('a[xplain]')?.getAttribute('xplain');
  };

  getAlternateHadith = (info) => {
    const alternateHadith = info.querySelector('a[href$="?alts=1"]');
    return alternateHadith?.getAttribute('href');
  };

  getSimilarHadith = (info) => {
    const similarHadith = info.querySelector('a[href$="?sims=1"]');
    return similarHadith?.getAttribute('href');
  };

  getHadithId = (info) => {
    const hadithId = info.querySelector('a[tag]');
    return hadithId?.getAttribute('tag');
  };
}

export default new ExtractorHelper();
