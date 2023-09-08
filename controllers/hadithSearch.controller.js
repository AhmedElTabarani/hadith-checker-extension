import * as cache from '../utils/cache.js';
import queryOptions from './queryOptions.controller.js';
import extractorHelper from '../utils/ExtractorHelper.js';
import paginationController from './pagination.controller.js';

class HadithSearchController {
  constructor() {
    this.resetData();
    this.tabId = 'main-tab';
    this.parser = new DOMParser();
  }

  resetData = () => {
    this.options = queryOptions.getAllOptions();
    this.query = queryOptions.convertOptionsToQueryString(this.tabId);
    this.specialistType =
      this.options.specialist.value === true ? 'specialist' : 'home';
  };

  setTabId = (tabId) => {
    this.tabId = tabId;
  };

  searchUsingSiteDorar = async (text) => {
    this.resetData();
    const page = paginationController.getPage();
    const url = `https://www.dorar.net/hadith/search?q=${text}&page=${page}&${
      this.query
    }&${this.specialistType === 'specialist' ? '&all' : ''}`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const data = await fetch(encodeURI(url));
    const html = he.decode(await data.text());
    const doc = this.parser.parseFromString(
      html,
      'text/html',
    ).documentElement;

    const numberOfNonSpecialist = +doc
      .querySelector('a[aria-controls="home"]')
      .textContent.match(/\d+/)[0];

    const numberOfSpecialist = +doc
      .querySelector('a[aria-controls="specialist"]')
      .textContent.match(/\d+/)[0];

    const result = Array.from(
      doc.querySelectorAll(`#${this.specialistType} .border-bottom`),
    ).map((info) => {
      const hadith = this.options.highlightWords
        ? info.children[0].innerHTML.replace(/\d+\s+-/g, '').trim()
        : info.children[0].textContent.replace(/\d+\s+-/g, '').trim();

      const [
        rawi,
        mohdith,
        book,
        numberOrPage,
        grade,
        explainGradeOrTakhrij,
      ] = [
        ...info.children[1].querySelectorAll('.primary-text-color'),
      ].map((el) => el.textContent.trim());

      const [explainGrade, takhrij] =
        this.specialistType === 'home'
          ? [explainGradeOrTakhrij, undefined]
          : [undefined, explainGradeOrTakhrij];

      const sharhId = extractorHelper.getSharhId(info);
      const mohdithId = extractorHelper.getMohdithId(info);
      const bookId = extractorHelper.getBookId(info);

      const [similarHadithDorar, alternateHadithSahihDorar] =
        extractorHelper.getSimilarAndAlternateHadithIds(info);

      const hadithId = extractorHelper.getHadithId(
        similarHadithDorar,
        alternateHadithSahihDorar,
      );

      return {
        hadith,
        rawi,
        mohdith,
        mohdithId,
        book,
        bookId,
        numberOrPage,
        grade,
        explainGrade,
        takhrij,
        hadithId,
        hasSimilarHadith: !!similarHadithDorar,
        hasAlternateHadithSahih: !!alternateHadithSahihDorar,
        similarHadithDorar,
        alternateHadithSahihDorar,
        urlToGetSmilarHadith: similarHadithDorar
          ? `/v1/site/hadith/similar/${hadithId}`
          : undefined,
        urlToGetAlternateHadithSahih: alternateHadithSahihDorar
          ? `/v1/site/hadith/alternate/${hadithId}`
          : undefined,
        hasSharhMetadata: !!sharhId,
        sharhMetadata: sharhId
          ? {
              id: sharhId,
              isContainSharh: false,
              urlToGetSharh: `/v1/site/sharh/${sharhId}`,
            }
          : undefined,
      };
    });

    const metadata = {
      length: result.length,
      page: page,
      specialist: this.specialistType === 'specialist',
      numberOfNonSpecialist,
      numberOfSpecialist,
    };

    cache.set(url, { data: result, metadata });
    return { data: result, metadata };
  };

  getAllSimilarHadithUsingSiteDorar = async (similarId) => {
    const url = `https://www.dorar.net/h/${similarId}?sims=1`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const data = await fetch(encodeURI(url));
    const html = he.decode(await data.text());
    const doc = this.parser.parseFromString(
      html,
      'text/html',
    ).documentElement;

    const result = Array.from(
      doc.querySelectorAll(`.border-bottom`),
    ).map((info) => {
      const hadith = info.children[0].textContent
        .replace(/-\s*\:?\s*/g, '')
        .trim();

      const [rawi, mohdith, book, numberOrPage, grade, explainGrade] =
        [
          ...info.children[1].querySelectorAll('.primary-text-color'),
        ].map((el) => el.textContent.trim());

      let sharhId = extractorHelper.getSharhId(info);
      sharhId = sharhId === '0' ? undefined : sharhId;

      const mohdithId = extractorHelper.getMohdithId(info);
      const bookId = extractorHelper.getBookId(info);

      const [similarHadithDorar, alternateHadithSahihDorar] =
        extractorHelper.getSimilarAndAlternateHadithIds(info);

      const hadithId = extractorHelper.getHadithId(
        similarHadithDorar,
        alternateHadithSahihDorar,
      );

      return {
        hadith,
        rawi,
        mohdith,
        mohdithId,
        book,
        bookId,
        numberOrPage,
        grade,
        explainGrade,
        hadithId,
        hasSimilarHadith: !!similarHadithDorar,
        hasAlternateHadithSahih: !!alternateHadithSahihDorar,
        similarHadithDorar,
        alternateHadithSahihDorar,
        urlToGetSmilarHadith: similarHadithDorar
          ? `/v1/site/hadith/similar/${hadithId}`
          : undefined,
        urlToGetAlternateHadithSahih: alternateHadithSahihDorar
          ? `/v1/site/hadith/alternate/${hadithId}`
          : undefined,
        hasSharhMetadata: !!sharhId,
        sharhMetadata: sharhId
          ? {
              id: sharhId,
              isContainSharh: false,
              urlToGetSharh: `/v1/site/sharh/${sharhId}`,
            }
          : undefined,
      };
    });

    const metadata = {
      length: result.length,
    };

    cache.set(url, { data: result, metadata });
    return { data: result, metadata };
  };

  getAlternateHadithUsingSiteDorar = async (alternateId) => {
    const url = `https://www.dorar.net/h/${alternateId}?alts=1`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const data = await fetch(encodeURI(url));
    const html = he.decode(await data.text());
    const doc = this.parser.parseFromString(
      html,
      'text/html',
    ).documentElement;

    const info = doc.querySelectorAll('.border-bottom')[1];

    const hadith = info.children[0].textContent
      .replace(/-\s*\:?\s*/g, '')
      .trim();

    const [rawi, mohdith, book, numberOrPage, grade] = [
      ...info.children[1].querySelectorAll('.primary-text-color'),
    ].map((el) => el.textContent.trim());

    const sharhId = extractorHelper.getSharhId(info);
    const mohdithId = extractorHelper.getMohdithId(info);
    const bookId = extractorHelper.getBookId(info);

    const [similarHadithDorar] =
      extractorHelper.getSimilarAndAlternateHadithIds(info);

    const hadithId = extractorHelper.getHadithId(
      similarHadithDorar,
      undefined,
    );

    const result = {
      hadith,
      rawi,
      mohdith,
      mohdithId,
      book,
      bookId,
      numberOrPage,
      grade,
      hadithId,
      hasSimilarHadith: !!similarHadithDorar,
      hasAlternateHadithSahih: false,
      similarHadithDorar,
      urlToGetSmilarHadith: similarHadithDorar
        ? `/v1/site/hadith/similar/${hadithId}`
        : undefined,
      hasSharhMetadata: !!sharhId,
      sharhMetadata: sharhId
        ? {
            id: sharhId,
            isContainSharh: false,
            urlToGetSharh: `/v1/site/sharh/${sharhId}`,
          }
        : undefined,
    };

    cache.set(url, { data: result });
    return { data: result };
  };
}

export default new HadithSearchController();
