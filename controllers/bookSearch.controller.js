import * as cache from '../utils/cache.js';

class BookSearchController {
  constructor() {
    this.parser = new DOMParser();
  }

  getOneBookByIdUsingSiteDorar = async (bookId) => {
    const url = `https://dorar.net/hadith/book-card/${bookId}`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const response = await fetch(encodeURI(url));
    const htmlString = he.decode(await response.json());
    const doc = this.parser.parseFromString(
      htmlString,
      'text/html',
    ).documentElement;

    const name = doc
      .querySelector('h5')
      ?.textContent.replace(/^\d+\s-/, '')
      .trim() || '';

    const spans = [...doc.querySelectorAll('span')].map((el) =>
      el.textContent.trim(),
    );

    const [author, reviewer, publisher, edition, editionYear] = spans;

    const result = {
      name,
      bookId,
      author: author || '',
      reviewer: reviewer || '',
      publisher: publisher || '',
      edition: edition || '',
      editionYear: editionYear?.match(/^\d+/)?.[0] || '',
    };

    cache.set(url, { data: result });
    return { data: result };
  };
}

export default new BookSearchController();
