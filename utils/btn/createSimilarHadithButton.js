import { getAllSimilarHadithById } from '../getAllSimilarHadithById.js';
import { setPopupLoader, hidePopupLoader } from '../loader.js';
import { generateHadithCard } from '../adapters/generateHadithCard.js';

const popupCard = document.getElementById('popup-card');
const exitPopupCard = document.getElementById('exit-popup');
const body = document.getElementsByTagName('body')[0];

export const createSimilarHadithButton = (hadithId) => {
  const btn = document.createElement('button');
  btn.classList.add('similar-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', hadithId);
  btn.textContent = 'أحاديث مشابهة';

  btn.addEventListener('click', async (e) => {
    btn.disabled = true;
    const result = await getAllSimilarHadithById(e.target.value);
    if (result.length === 0) return;

    setPopupLoader();

    const cards = document.createElement('section');
    cards.classList.add('cards');

    for (let i = 0; i < result.length; i++)
      cards.appendChild(generateHadithCard(result[i]));

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
