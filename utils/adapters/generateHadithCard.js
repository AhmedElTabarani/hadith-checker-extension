export const generateHadithCard = (hadithObj) => {
  const {
    hadith,
    rawi,
    mohdith,
    book,
    numberOrPage,
    grade,
    explainGrade,
    takhrij,
  } = hadithObj;

  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <div>
      <p class="hadith">${hadith}</p>
      <hr/>
      <div class="hadith-info">
        <span class="hadith-rawi"><span class="info-subtitle">الراوي:</span> ${rawi}</span>
        <span class="hadith-mohdith"><span class="info-subtitle">المحدث:</span> ${mohdith}</span>
        <span class="hadith-book"><span class="info-subtitle">الكتاب:</span> ${book}</span>
        <span class="hadith-number"><span class="info-subtitle">رقم الحديث أو الصفحة:</span> ${numberOrPage}</span>
        <span class="hadith-grade"><span class="info-subtitle">حكم المحدث:</span> ${grade}</span>
        ${
          explainGrade
            ? `<span class="hadith-explain-grade"><span class="info-subtitle">توضيح حكم الحديث:</span> ${explainGrade}</span>`
            : ''
        }
        ${
          takhrij
            ? `<span class="hadith-takhrij"><span class="info-subtitle">تخريج الحديث في الكتب الأخرى:</span> ${takhrij}</span>`
            : ''
        }
      </div>
    </div>
  `;

  // Add sharh
  const hasSharhMetadata = hadithObj.hasSharhMetadata;
  if (hasSharhMetadata) {
    const sharhMetadata = hadithObj.sharhMetadata;
    const { isContainSharh } = sharhMetadata;
    if (isContainSharh) {
      const sharh = sharhMetadata.sharh;
      card.innerHTML += `<hr/><h2>شرح الحديث:</h2><p class="sharh">${sharh}</p>`;
    }
  }

  return card;
};
