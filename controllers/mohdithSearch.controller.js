import * as cache from '../utils/cache.js';

class MohdithSearchController {
  constructor() {
    this.parser = new DOMParser();
  }

  getOneMohdithByIdUsingSiteDorar = async (mohdithId) => {
    const url = `https://dorar.net/hadith/mhd/${mohdithId}`;

    const cachedData = await cache.get(url);
    if (cachedData) return cachedData;

    const data = await fetch(encodeURI(url));
    const html = he.decode(await data.text());
    const doc = this.parser.parseFromString(
      html,
      'text/html',
    ).documentElement;

    const h4 = doc.querySelector('h4');
    const name = h4?.textContent?.trim() || '';
    const info = h4?.nextSibling?.textContent?.trim() || '';

    const result = {
      name,
      mohdithId,
      info,
    };

    cache.set(url, { data: result });
    return { data: result };
  };
}

export default new MohdithSearchController();
