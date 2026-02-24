import hadithSearchController from '../../controllers/hadithSearch.controller.js';
import { setPopupLoader, hidePopupLoader } from '../loader.js';
import { generateDorarHadithCard } from '../adapters/generateDorarHadithCard.js';

const popupCard = document.getElementById('popup-card');
const exitPopupCard = document.getElementById('exit-popup');
const body = document.getElementsByTagName('body')[0];

export const createUsulHadithButton = (usulId) => {
  const btn = document.createElement('button');
  btn.classList.add('usul-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.setAttribute('value', usulId);
  btn.textContent = 'أصول الحديث';

  btn.addEventListener('click', async (e) => {
    btn.disabled = true;
    setPopupLoader();

    const cards = document.createElement('section');
    cards.classList.add('cards');

    const { data } =
      await hadithSearchController.getUsulHadithUsingSiteDorar(
        e.target.value,
      );

    if (!data) {
      hidePopupLoader();
      const noDataCard = document.createElement('div');
      noDataCard.classList.add('card');
      noDataCard.innerHTML = `
        <div>
          <h3 class="no-data-title">لا يوجد أصول الحديث</h3>
        </div>
      `;
      cards.appendChild(noDataCard);
      popupCard.replaceChildren(cards);
      body.classList.add('scroll-disable');
      popupCard.style.display = 'flex';
      exitPopupCard.style.display = 'block';
      btn.disabled = false;
      return;
    }

    // Create main hadith card
    const mainCard = generateDorarHadithCard(data);
    cards.appendChild(mainCard);

    // Create usul sources cards if they exist
    if (data.usulHadith && data.usulHadith.sources.length > 0) {
      data.usulHadith.sources.forEach((source, index) => {
        const sourceCard = document.createElement('div');
        sourceCard.classList.add('card');
        
        sourceCard.innerHTML = `
          <div>
            <h4 class="usul-source-title">مصدر ${index + 1}</h4>
            ${source.source ? `<p class="usul-source-name"><span class="info-subtitle">المصدر:</span> ${source.source}</p>` : ''}
            ${source.chain ? `<p class="usul-chain"><span class="info-subtitle">السند:</span> ${source.chain}</p>` : ''}
            ${source.hadithText ? `<p class="usul-hadith-text"><span class="info-subtitle">نص الحديث:</span> ${source.hadithText}</p>` : ''}
          </div>
        `;
        
        cards.appendChild(sourceCard);
      });
    }

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
