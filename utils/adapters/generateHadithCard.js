export const generateHadithCard = (hadithObj) => {
  const {
    hadith,
    el_rawi,
    el_mohdith,
    source,
    number_or_page,
    grade,
    explainGrade,
  } = hadithObj;

  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <div>
      <p class="hadith">${hadith}</p>
      <hr/>
      <div class="hadith-info">
        <span class="hadith-rawi"><span class="info-subtitle">الراوي:</span> ${el_rawi}</span>
        <span class="hadith-mohdith"><span class="info-subtitle">المحدث:</span> ${el_mohdith}</span>
        <span class="hadith-source"><span class="info-subtitle">المصدر:</span> ${source}</span>
        <span class="hadith-number"><span class="info-subtitle">رقم الحديث أو الصفحة:</span> ${number_or_page}</span>
        <span class="hadith-grade"><span class="info-subtitle">صحة الحديث:</span> ${grade}</span>
        ${
          explainGrade
            ? `<span class="hadith-explain-grade"><span class="info-subtitle">توضيح حكم  صحة الحديث:</span> ${explainGrade}</span>`
            : ''
        }
      </div>
    </div>
  `;

  // Add sharh button
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
