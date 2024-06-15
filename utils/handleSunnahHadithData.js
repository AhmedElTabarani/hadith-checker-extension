import { createCopyButton } from './btn/createCopyButton.js';
import { createSharhButton } from './btn/createSharhButton.js';
import { createSimilarHadithButton } from './btn/createSimilarHadithButton.js';
import { createAlternateHadithSahihButton } from './btn/createAlternateHadithSahihButton.js';
import { createCopyAsAnImageButton } from './btn/createCopyAsAnImageButton.js';
import { generateSunnahHadithCard } from './adapters/generateSunnahHadithCard.js';

const content = document.getElementById('content');

export default (allHadith) => {
  const cards = document.createElement('section');
  cards.classList.add('cards');

  allHadith.forEach((hadith) => {
    const card = generateSunnahHadithCard(hadith);

    // Add copy button
    const copyBtn = createCopyButton('.sunnah-search-link');
    card.appendChild(copyBtn);

    // Add copy as an image button
    const copyAsAnImageButton = createCopyAsAnImageButton('المصدر موقع السنة: https://sunnah.com/');
    card.appendChild(copyAsAnImageButton);

    cards.appendChild(card);
    return card;
  });

  content.replaceChildren(cards);
};
