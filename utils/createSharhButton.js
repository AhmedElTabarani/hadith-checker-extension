import { getSharhById } from './getSharhById.js';
import { setPopupLoader, hidePopupLoader } from './loader.js';
import { generateHadithCard } from './adapters/generateHadithCard.js';

const popupCard = document.getElementById('popup-card');
const exitPopupCard = document.getElementById('exit-popup');
const body = document.getElementsByTagName('body')[0];

export const createSharhButton = (sharhId) => {
  const btn = document.createElement('button');
  btn.classList.add('sharh-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', sharhId);
  btn.textContent = 'شرح الحديث';

  btn.addEventListener('click', async (e) => {
    setPopupLoader();
    const result = await getSharhById(e.target.value);
    const card = generateHadithCard(result);
    hidePopupLoader();
    popupCard.lastChild?.remove(); // remove old card
    popupCard.appendChild(card);
    body.classList.add('scroll-disable');
    popupCard.style.display = 'flex';
    exitPopupCard.style.display = 'block';
  });

  return btn;
};

exitPopupCard.addEventListener('click', () => {
  body.classList.remove('scroll-disable');
  popupCard.style.display = 'none';
  exitPopupCard.style.display = 'none';
});
