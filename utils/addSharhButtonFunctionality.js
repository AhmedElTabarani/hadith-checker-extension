import { getSharhById } from './getSharhById.js';
import { generateHadithCard } from './adapters/generateHadithCard.js';

const popupCard = document.getElementById('popup-card');


export const addSharhButtonFunctionality = (sharhBtnClass) => {
  const sharhButtons = document.getElementsByClassName(sharhBtnClass);
  for (const btn of sharhButtons) {
    btn.addEventListener('click', async (e) => {
      const result = await getSharhById(e.target.value);
      const card = generateHadithCard(result);
      popupCard.innerHTML = card;
      popupCard.style.display = 'block';
    });
  }
};
