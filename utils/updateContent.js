import { createCopyButton } from './createCopyButton.js';
import { createSharhButton } from './createSharhButton.js';
import { generateHadithCard } from './adapters/generateHadithCard.js';

const content = document.getElementById('content');

export const updateContent = async (allHadith) => {
  const cards = document.createElement('section');
  cards.classList.add('cards');

  allHadith.map((hadith) => {
    const card = generateHadithCard(hadith);

    // Add copy button
    const copyBtn = createCopyButton();
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

    cards.appendChild(card);
    return card;
  });

  content.appendChild(cards);

  // addSharhButtonFunctionality('sharh-btn');
};
