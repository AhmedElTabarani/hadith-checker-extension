export const generateHadithCard = (hadithObj) => {
  const {
    hadith,
    el_rawi,
    el_mohdith,
    source,
    number_or_page,
    grade,
  } = hadithObj;

  const card = document.createElement('div');
  card.classList.add('card');

  const cardContent = `
    <div>
      <p class="hadith">${hadith}</p>
      <hr/>
      <div class="hadith-info">
        <span class="hadith-rawi"><span class="info-subtitle">الراوي:</span> ${el_rawi}</span>
        <span class="hadith-mohdith"><span class="info-subtitle">المحدث:</span> ${el_mohdith}</span>
        <span class="hadith-source"><span class="info-subtitle">المصدر:</span> ${source}</span>
        <span class="hadith-number"><span class="info-subtitle">رقم الحديث أو الصفحة:</span> ${number_or_page}</span>
        <span class="hadith-grade"><span class="info-subtitle">صحة الحديث:</span> ${grade}</span>
      </div>
    </div>
    <button class="copy-btn nice-btn" type="button">نسخ الحديث</button>
  `;

  card.innerHTML = cardContent;
  return card.outerHTML;
};