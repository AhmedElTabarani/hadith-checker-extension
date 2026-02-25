import { createCopyButton } from './btn/createCopyButton.js';
import { createSharhButton } from './btn/createSharhButton.js';
import { createSimilarHadithButton } from './btn/createSimilarHadithButton.js';
import { createAlternateHadithSahihButton } from './btn/createAlternateHadithSahihButton.js';
import { createUsulHadithButton } from './btn/createUsulHadithButton.js';
import { generateDorarHadithCard } from './adapters/generateDorarHadithCard.js';
import { createCopyAsAnImageButton } from './btn/createCopyAsAnImageButton.js';
import { attachMohdithInfoHandlers } from './btn/attachMohdithInfoHandlers.js';
import { attachBookInfoHandlers } from './btn/attachBookInfoHandlers.js';

const content = document.getElementById('content');

export default (allHadith) => {
  const cards = document.createElement('section');
  cards.classList.add('cards');

  allHadith.forEach((hadith) => {
    const card = generateDorarHadithCard(hadith);

    // Attach mohdith and book info popup handlers
    attachMohdithInfoHandlers(card);
    attachBookInfoHandlers(card);

    // Add copy button
    const copyBtn = createCopyButton('.dorar-search-link');
    card.appendChild(copyBtn);

    // Check if hadith has a sharh
    const hasSharhMetadata = hadith.hasSharhMetadata;
    if (hasSharhMetadata) {
      const sharhMetadata = hadith.sharhMetadata;
      const { id: sharhId, isContainSharh } = sharhMetadata;
      if (!isContainSharh) {
        // Add sharh button
        const sharhBtn = createSharhButton(sharhId);
        card.appendChild(sharhBtn);
      }
    }

    const hadithId = hadith.hadithId;
    // Add similar hadith button
    const hasSimilarHadith = hadith.hasSimilarHadith;
    if (hasSimilarHadith) {
      const similarHadithBtn = createSimilarHadithButton(hadithId);
      card.appendChild(similarHadithBtn);
    }

    // Add alternate hadith button
    const hasAlternateHadithSahih = hadith.hasAlternateHadithSahih;
    if (hasAlternateHadithSahih) {
      const alternateHadithBtn =
        createAlternateHadithSahihButton(hadithId);
      card.appendChild(alternateHadithBtn);
    }

    // Add usul hadith button
    const hasUsulHadith = hadith.hasUsulHadith;
    if (hasUsulHadith) {
      const usulHadithBtn = createUsulHadithButton(hadithId);
      card.appendChild(usulHadithBtn);
    }

    // Add copy as an image button
    const copyAsAnImageButton = createCopyAsAnImageButton(
      'المصدر موقع الدرر السَنية: https://dorar.net/hadith',
    );
    card.appendChild(copyAsAnImageButton);

    cards.appendChild(card);
    return card;
  });

  content.replaceChildren(cards);
};
