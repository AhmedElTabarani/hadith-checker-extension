export const generateSunnahHadithCard = (hadithObj) => {
  const { collection, book, english, arabic, reference } = hadithObj;

  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
      <div>
        <div dir="ltr">
          ${
            english.hadithNarrated
              ? `<p class="hadith-narrated">${english.hadithNarrated}</p>`
              : ''
          }
          ${
            english.hadith
              ? `<p class="hadith">${english.hadith}</p>`
              : english.fullHadith
              ? `<p class="hadith">${english.fullHadith}</p>`
              : ''
          }
          <hr />
          <div class="hadith-info">
            ${
              book
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">Book:</span> ${book}</span>`
                : ''
            }
            ${
              collection
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">Collection:</span>
              ${collection}</span>`
                : ''
            }
            ${
              reference.hadithNumberInBook
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">Number of the hadith in book:</span>
              ${reference.hadithNumberInBook}</span>`
                : ''
            }
            ${
              reference.hadithNumberInCollection
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">Number of the hadith in collection:</span>
              ${reference.hadithNumberInCollection}</span>`
                : ''
            }
            ${
              english.grade
                ? `<span class="hadith-grade"><span class="info-subtitle">Grade:</span> ${english.grade}</span>`
                : ''
            }
          </div>
        </div>
        <hr />
        <div>
          ${
            arabic.hadithNarrated
              ? `<p class="hadith-narrated">${arabic.hadithNarrated}</p>`
              : ''
          }
          ${
            arabic.hadith
              ? `<p class="hadith">${arabic.hadith}</p>`
              : arabic.fullHadith
              ? `<p class="hadith">${arabic.fullHadith}</p>`
              : ''
          }
          <hr />
          <div class="hadith-info">
            ${
              book
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">الكتاب:</span> ${book}</span>`
                : ''
            }
            ${
              collection
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">المجموعة:</span>
              ${collection}</span>`
                : ''
            }
            ${
              reference.hadithNumberInBook
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">رقم الحديث في الكتاب:</span>
              ${reference.hadithNumberInBook}</span>`
                : ''
            }
            ${
              reference.hadithNumberInCollection
                ? `<span class="hadith-number-in-book"><span class="info-subtitle">رقم الحديث في المجموعة:</span>
              ${reference.hadithNumberInCollection}</span>`
                : ''
            }
            ${
              arabic.grade
                ? `<span class="hadith-grade"><span class="info-subtitle">حكم المحدث:</span> ${arabic.grade}</span>`
                : ''
            }
          </div>
        </div>
      </div>
  `;

  return card;
};
