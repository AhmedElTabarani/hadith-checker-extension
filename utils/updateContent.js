import { addCopyButtonFunctionality } from './addCopyButtonFunctionality.js';
import { addSharhButtonFunctionality } from './addSharhButtonFunctionality.js';
import { generateHadithCard } from './adapters/generateHadithCard.js';

const content = document.getElementById('content');

export const updateContent = (allHadith) => {
  const allCardsDiv = allHadith.map(generateHadithCard).join('');

  content.innerHTML = `
    <section class="cards">
      ${allCardsDiv}
    </section>
    `;

  addCopyButtonFunctionality('copy-btn');
  addSharhButtonFunctionality('sharh-btn');
};
