import { getSharhById } from './getSharhById.js';
import { setPopupLoader, hidePopupLoader } from './loader.js';
import { generateHadithCard } from './adapters/generateHadithCard.js';

const popupCard = document.getElementById('popup-card');
const exitPopupCard = document.getElementById('exit-popup');
const body = document.getElementsByTagName('body')[0];

export const addSharhButtonFunctionality = (sharhBtnClass) => {
  const sharhButtons = document.getElementsByClassName(sharhBtnClass);
  for (const btn of sharhButtons) {
    btn.addEventListener('click', async (e) => {
      setPopupLoader();
      const result = await getSharhById(e.target.value);
      const card = generateHadithCard(result);
      hidePopupLoader();
      popupCard.innerHTML = card;
      body.classList.add('scroll-disable');
      popupCard.style.display = 'flex';
      exitPopupCard.style.display = 'block';
    });
  }
};

exitPopupCard.addEventListener('click', () => {
  body.classList.remove('scroll-disable');
  popupCard.style.display = 'none';
  exitPopupCard.style.display = 'none';
});
