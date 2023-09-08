import hadithSearchController from '../../controllers/hadithSearch.controller.js';
import { setPopupLoader, hidePopupLoader } from '../loader.js';
import { generateHadithCard } from '../adapters/generateHadithCard.js';

const popupCard = document.getElementById('popup-card');
const exitPopupCard = document.getElementById('exit-popup');
const body = document.getElementsByTagName('body')[0];

export const createAlternateHadithSahihButton = (alternateId) => {
  const btn = document.createElement('button');
  btn.classList.add('alternate-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', alternateId);
  btn.textContent = 'الصحيح البديل';

  btn.addEventListener('click', async (e) => {
    btn.disabled = true;
    setPopupLoader();

    const cards = document.createElement('section');
    cards.classList.add('cards');

    const { data } =
      await hadithSearchController.getAlternateHadithUsingSiteDorar(
        e.target.value,
      );
    const card = generateHadithCard(data);
    cards.appendChild(card);

    hidePopupLoader();
    popupCard.replaceChildren(cards);
    body.classList.add('scroll-disable');
    popupCard.style.display = 'flex';
    exitPopupCard.style.display = 'block';
    btn.disabled = false;
  });

  return btn;
};

exitPopupCard.addEventListener('click', () => {
  body.classList.remove('scroll-disable');
  popupCard.style.display = 'none';
  exitPopupCard.style.display = 'none';
});
