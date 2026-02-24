import bookSearchController from '../../controllers/bookSearch.controller.js';
import { setPopupLoader, hidePopupLoader } from '../loader.js';

const popupCard = document.getElementById('popup-card');
const exitPopupCard = document.getElementById('exit-popup');
const body = document.getElementsByTagName('body')[0];

/**
 * Attaches click handlers to all book info links inside a card.
 * @param {HTMLElement} card - The card element containing .book-info-link elements
 */
export const attachBookInfoHandlers = (card) => {
  const links = card.querySelectorAll('.book-info-link');
  links.forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const bookId = e.target.dataset.bookId;
      if (!bookId) return;

      setPopupLoader();

      try {
        const { data } =
          await bookSearchController.getOneBookByIdUsingSiteDorar(
            bookId,
          );

        const infoCard = document.createElement('div');
        infoCard.classList.add('card', 'info-popup-card');

        infoCard.innerHTML = `
          <div>
            <h3 class="info-popup-title">
              <i class="fa fa-book"></i>
              معلومات الكتاب
            </h3>
            <hr/>
            <div class="info-popup-content">
              <p><span class="info-subtitle">اسم الكتاب:</span> ${data.name}</p>
              ${data.author ? `<p><span class="info-subtitle">المؤلف:</span> ${data.author}</p>` : ''}
              ${data.reviewer ? `<p><span class="info-subtitle">المحقق:</span> ${data.reviewer}</p>` : ''}
              ${data.publisher ? `<p><span class="info-subtitle">الناشر:</span> ${data.publisher}</p>` : ''}
              ${data.edition ? `<p><span class="info-subtitle">الطبعة:</span> ${data.edition}</p>` : ''}
              ${data.editionYear ? `<p><span class="info-subtitle">سنة الطبعة:</span> ${data.editionYear}</p>` : ''}
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
        console.error('Error fetching book info:', err);
      }
    });
  });
};
