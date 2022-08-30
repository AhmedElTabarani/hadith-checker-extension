const cards = document.getElementsByClassName('cards')[0];

chrome.storage.local.get('AllHadith', ({ AllHadith }) => {
  const allCardsDiv = AllHadith.map((_hadith) => {
    const { hadith, el_rawi, el_mohdith, source, number_or_page, grade } =
      _hadith;

    return `<div class="card">
             <p class="hadith-text">${hadith}</p>
             <div class="hadith-info">
                <p class="hadith-rawi"><span>الراوي:</span> ${el_rawi}</p>
                <p class="hadith-mohdith"><span>المتحدث:</span> ${el_mohdith}</p>
                <p class="hadith-source"><span>المصدر:</span> ${source}</p>
                <p class="hadith-number"><span>رقم الحديث أو الصفحة:</span> ${number_or_page}</p>
                <p class="hadith-grade"><span>صحة الحديث:</span> ${grade}</p>
             </div>
        </div>`;
  });

  cards.innerHTML = allCardsDiv.join('');
});
