import * as cache from '../utils/cache.js';
import queryOptions from './queryOptions.controller.js';
import extractorHelper from '../utils/ExtractorHelper.js';
import paginationController from './pagination.controller.js';
import getSunnahHadithInfoText from '../utils/getSunnahHadithInfoText.js';
import getSunnahHadithInfoHTML from '../utils/getSunnahHadithInfoHTML.js';
import getSunnahHadithReferenceValues from '../utils/getSunnahHadithReferenceValues.js';
import getSunnahHadithReferenceUrlInfo from '../utils/getSunnahHadithReferenceUrlInfo.js';
import parseHadithInfo from '../utils/parseHadithInfo.js';

class HadithSearchController {
  constructor() {
    this.resetDorarData();
    this.tabId = 'main-tab';
    this.parser = new DOMParser();
  }

  resetDorarData = () => {
    this.options = queryOptions.getAllOptions();
    this.query = queryOptions.convertOptionsToQueryString(this.tabId);
    this.specialistType =
      this.options.specialist.value === true ? 'specialist' : 'home';
  };

  setTabId = (tabId) => {
    this.tabId = tabId;
  };

  search = async (text) => {
    switch (this.tabId) {
      case 'main-tab':
      case 'bukhari-tab':
      case 'muslim-tab':
        return this.searchUsingSiteDorar(text);
      case 'sunnah-site-tab':
        return this.searchUsingSiteSunnah(text);
    }
  };

  searchUsingSiteDorar = async (text) => {
    this.resetDorarData();
    const page = paginationController.getPage();
    const url = `https://dorar.net/hadith/search?q=${text}&page=${page}&${
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

      const parsedInfo = parseHadithInfo(info.children[1]);
      const {
        rawi,
        mohdith,
        mohdithId,
        book,
        bookId,
        numberOrPage,
        grade,
        explainGrade,
        takhrij,
        sharhId
      } = parsedInfo;

      const [similarHadithDorar, alternateHadithSahihDorar, usulHadithDorar] = [
        extractorHelper.getSimilarHadith(info),
        extractorHelper.getAlternateHadith(info),
        extractorHelper.getUsulHadith(info),
      ];

      const hadithId = extractorHelper.getHadithId(info);

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
        hasUsulHadith: !!usulHadithDorar,
        similarHadithDorar,
        alternateHadithSahihDorar,
        usulHadithDorar,
        urlToGetSimilarHadith: similarHadithDorar
          ? `/v1/site/hadith/similar/${hadithId}`
          : undefined,
        urlToGetAlternateHadithSahih: alternateHadithSahihDorar
          ? `/v1/site/hadith/alternate/${hadithId}`
          : undefined,
        urlToGetUsulHadith: usulHadithDorar
          ? `/v1/site/hadith/usul/${hadithId}`
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

  searchUsingSiteSunnah = async (text) => {
    const page = paginationController.getPage();

    const url = `https://sunnah.com/search?q=${text}&page=${page}`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const data = await fetch(encodeURI(url));
    const html = he.decode(await data.text());
    const doc = this.parser.parseFromString(
      html,
      'text/html',
    ).documentElement;

    const allHadith = doc.querySelector('.AllHadith');

    if (!allHadith) {
      return [];
    }

    const totalOfHadith = +allHadith
      .querySelector('span')
      .textContent.split(' ')
      .at(-1);

    const result = Array.from(doc.querySelectorAll('.boh')).map(
      (info) => {
        const [collection, book] =
          info.querySelectorAll('.nounderline');

        const {
          englishHadithNarrated,
          englishHadith,
          englishFullHadith,
          englishGrade,
          arabicHadithNarrated,
          arabicHadith,
          arabicFullHadith,
          arabicGrade,
        } = this.options.highlightWords
          ? getSunnahHadithInfoHTML(info)
          : getSunnahHadithInfoText(info);

        const english = {
          hadithNarrated: englishHadithNarrated,
          hadith: englishHadith,
          fullHadith: englishFullHadith,
          grade: englishGrade,
        };
        const arabic = {
          hadithNarrated: arabicHadithNarrated,
          hadith: arabicHadith,
          fullHadith: arabicFullHadith,
          grade: arabicGrade,
        };

        const reference = info.querySelector('.hadith_reference');
        const { hadithNumberInBook, hadithNumberInCollection } =
          getSunnahHadithReferenceValues(reference);

        const collectionId = collection
          .getAttribute('href')
          .split('/')
          .at(-1);

        const bookId = book.getAttribute('href').split('/').at(-1);
        return {
          collection: collection.textContent.trim(),
          book: book.textContent.trim(),
          english,
          arabic,
          reference: {
            ...getSunnahHadithReferenceUrlInfo(
              collectionId,
              bookId,
              hadithNumberInBook,
              hadithNumberInCollection,
            ),
          },
        };
      },
    );

    cache.set(url, result);

    const metadata = {
      numberOfHadith: result.length,
      totalOfHadith,
      page,
      numberOfPages: Math.ceil(totalOfHadith / 100),
    };

    cache.set(url, { data: result, metadata });
    return { data: result, metadata };
  };

  getAllSimilarHadithUsingSiteDorar = async (similarId) => {
    const url = `https://dorar.net/h/${similarId}?sims=1`;

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

      const parsedInfo = parseHadithInfo(info.children[1]);
      const {
        rawi,
        mohdith,
        mohdithId,
        book,
        bookId,
        numberOrPage,
        grade,
        explainGrade,
        takhrij,
        sharhId
      } = parsedInfo;

      const [similarHadithDorar, alternateHadithSahihDorar, usulHadithDorar] = [
        extractorHelper.getSimilarHadith(info),
        extractorHelper.getAlternateHadith(info),
        extractorHelper.getUsulHadith(info),
      ];

      const hadithId = extractorHelper.getHadithId(info);

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
        hasUsulHadith: !!usulHadithDorar,
        similarHadithDorar,
        alternateHadithSahihDorar,
        usulHadithDorar,
        urlToGetSimilarHadith: similarHadithDorar
          ? `/v1/site/hadith/similar/${hadithId}`
          : undefined,
        urlToGetAlternateHadithSahih: alternateHadithSahihDorar
          ? `/v1/site/hadith/alternate/${hadithId}`
          : undefined,
        urlToGetUsulHadith: usulHadithDorar
          ? `/v1/site/hadith/usul/${hadithId}`
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
    const url = `https://dorar.net/h/${alternateId}?alts=1`;

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

      const parsedInfo = parseHadithInfo(info.children[1]);
      const {
        rawi,
        mohdith,
        mohdithId,
        book,
        bookId,
        numberOrPage,
        grade,
        explainGrade,
        takhrij,
        sharhId
      } = parsedInfo;

    const similarHadithDorar = extractorHelper.getSimilarHadith(info);
    const usulHadithDorar = extractorHelper.getUsulHadith(info);

    const hadithId = extractorHelper.getHadithId(info);

    const result = {
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
      hasAlternateHadithSahih: false,
      hasUsulHadith: !!usulHadithDorar,
      similarHadithDorar,
      usulHadithDorar,
      urlToGetSimilarHadith: similarHadithDorar
        ? `/v1/site/hadith/similar/${hadithId}`
        : undefined,
      urlToGetUsulHadith: usulHadithDorar
        ? `/v1/site/hadith/usul/${hadithId}`
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

  getUsulHadithUsingSiteDorar = async (usulId) => {
    const url = `https://dorar.net/h/${usulId}?osoul=1`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const data = await fetch(encodeURI(url));
    const html = he.decode(await data.text());
    const doc = this.parser.parseFromString(
      html,
      'text/html',
    ).documentElement;

    // Get the main hadith info (first .border-bottom)
    const mainInfo = doc.querySelector('.border-bottom');
    if (!mainInfo) {
      throw new Error('No usul hadith found');
    }

    const mainHadith = mainInfo.children[0].textContent
      .replace(/-\s*\:?\s*/g, '')
      .trim();

    const parsedInfo = parseHadithInfo(mainInfo.children[1]);
    const {
      rawi,
      mohdith,
      mohdithId,
      book,
      bookId,
      numberOrPage,
      grade,
      explainGrade,
      takhrij,
      sharhId
    } = parsedInfo;

    const [similarHadithDorar, alternateHadithSahihDorar] = [
      extractorHelper.getSimilarHadith(mainInfo),
      extractorHelper.getAlternateHadith(mainInfo),
    ];

    const hadithId = extractorHelper.getHadithId(mainInfo);

    // Get the usul hadith sources (all articles after the heading)
    const usulSources = [];
    const articles = doc.querySelectorAll('article');
    
    // Skip the first article (main hadith) and process the rest
    for (let i = 1; i < articles.length; i++) {
      const article = articles[i];
      const sourceInfo = article.querySelector('h5');
      
      if (sourceInfo) {
        // Extract source name and page from the span with maroon color
        const sourceSpan = sourceInfo.querySelector('span[style*="color:maroon"]');
        const sourceName = sourceSpan?.textContent.trim() || '';
        
        // Extract the chain of narration from the span with blue color
        const chainSpan = sourceInfo.querySelector('span[style*="color:blue"]');
        const chain = chainSpan?.textContent.trim() || '';
        
        // Get the full text and extract the hadith text after the colored spans
        let fullText = sourceInfo.textContent.trim();
        
        // Remove the source name and chain to get the actual hadith text
        if (sourceName) {
          fullText = fullText.replace(sourceName, '').trim();
        }
        if (chain) {
          fullText = fullText.replace(chain, '').trim();
        }
        
        // Clean up the hadith text (remove leading commas, periods, etc.)
        const hadithText = fullText.replace(/^[،,.\s]+/, '').trim();
        
        usulSources.push({
          source: sourceName,
          chain: chain,
          hadithText: hadithText
        });
      }
    }

    const result = {
      hadith: mainHadith,
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
      hasUsulHadith: true,
      similarHadithDorar,
      alternateHadithSahihDorar,
      urlToGetSimilarHadith: similarHadithDorar
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
      usulHadith: {
        sources: usulSources,
        count: usulSources.length
      }
    };

    const metadata = {
      length: 1,
      usulSourcesCount: usulSources.length,
    };

    cache.set(url, { data: result, metadata });
    return { data: result, metadata };
  };
}

export default new HadithSearchController();
