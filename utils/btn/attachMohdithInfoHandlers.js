import mohdithSearchController from '../../controllers/mohdithSearch.controller.js';
import { setPopupLoader, hidePopupLoader } from '../loader.js';

const popupCard = document.getElementById('popup-card');
const exitPopupCard = document.getElementById('exit-popup');
const body = document.getElementsByTagName('body')[0];

/**
 * Attaches click handlers to all mohdith info links inside a card.
 * @param {HTMLElement} card - The card element containing .mohdith-info-link elements
 */
export const attachMohdithInfoHandlers = (card) => {
  const links = card.querySelectorAll('.mohdith-info-link');
  links.forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const mohdithId = e.target.dataset.mohdithId;
      if (!mohdithId) return;

      setPopupLoader();

      try {
        const { data } =
          await mohdithSearchController.getOneMohdithByIdUsingSiteDorar(
            mohdithId,
          );

        const infoCard = document.createElement('div');
        infoCard.classList.add('card', 'info-popup-card');

        infoCard.innerHTML = `
          <div>
            <h3 class="info-popup-title">
              <i class="fa fa-user-circle"></i>
              معلومات المحدث
            </h3>
            <hr/>
            <div class="info-popup-content">
              <p><span class="info-subtitle">الاسم:</span> ${data.name}</p>
              ${data.info ? `<p class="info-popup-details"><span class="info-subtitle">نبذة:</span> ${data.info}</p>` : ''}
            </div>
          </div>
        `;

        const cards = document.createElement('section');
        cards.classList.add('cards');
        cards.appendChild(infoCard);

        hidePopupLoader();
        popupCard.replaceChildren(cards);
        body.classList.add('scroll-disable');
        popupCard.style.display = 'flex';
        exitPopupCard.style.display = 'block';
      } catch (err) {
        hidePopupLoader();
        console.error('Error fetching mohdith info:', err);
      }
    });
  });
};
