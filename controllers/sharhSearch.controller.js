import * as cache from '../utils/cache.js';

class SharhSearchController {
  constructor() {
    this.parser = new DOMParser();
  }

  getOneSharhByIdUsingSiteDorar = async (sharhId) => {
    const url = `https://dorar.net/hadith/sharh/${sharhId}`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const data = await fetch(encodeURI(url));
    const html = he.decode(await data.text());
    const doc = this.parser.parseFromString(
      html,
      'text/html',
    ).documentElement;

    const hadith = doc
      .querySelector('article')
      .textContent.replace(/-\s*/g, '')
      .trim();

    const [rawi, mohdith, book, numberOrPage, grade, takhrij] = [
      ...doc.querySelectorAll('.primary-text-color'),
    ].map((el) => el.textContent.trim());

    const sharh = doc
      .querySelector('.text-justify')
      .nextElementSibling.textContent.trim();

    const result = {
      hadith,
      rawi,
      mohdith,
      book,
      numberOrPage,
      grade,
      takhrij,
      hasSharhMetadata: true,
      sharhMetadata: {
        id: sharhId,
        isContainSharh: true,
        urlToGetSharhById: `/v1/site/sharh/${sharhId}`,
        sharh,
      },
    };

    cache.set(url, { data: result });
    return { data: result };
  };
}

export default new SharhSearchController();
