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

  getSimilarAndAlternateHadithIds = (info) => {
    return Array.from(
      info.querySelectorAll(
        'a[style="margin-right:5px;color:#3399ff;"]',
      ),
    ).map((el) => el.getAttribute('href') || undefined);
  };

  getHadithId = (similarHadithDorar, alternateHadithSahihDorar) => {
    if (similarHadithDorar)
      return similarHadithDorar.match(/\/h\/(.*)\?/)[1];
    if (alternateHadithSahihDorar)
      return alternateHadithSahihDorar.match(/\/h\/(.*)\?/)[1];
    };
}

export default new ExtractorHelper();