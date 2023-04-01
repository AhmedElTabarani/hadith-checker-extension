import { convertOptionsToQueryString } from './utils/convertOptionsToQueryString.js';
import { getHadith } from './utils/getHadith.js';
import { showMessage } from './utils/sendMessage.js';
import { updateHadithCounter } from './utils/updateHadithCounter.js';
import { updatePageCounter } from './utils/updatePageCounter.js';

const content = document.getElementById('content');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const loader = document.getElementById('loader');
const settings = document.querySelector('.settings-box');

let currPage = 1;
let currText = '';
let dorarSearchLink = '';
let currQuery = '';
let currTabId = 'main-id';

const updateContent = (allHadith) => {
  const allCardsDiv = allHadith.map((_hadith) => {
    const {
      hadith,
      el_rawi,
      el_mohdith,
      source,
      number_or_page,
      grade,
    } = _hadith;

    return `
      <div class="card">
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
      </div>`;
  });

  content.innerHTML = `
  <section class="cards">
    ${allCardsDiv.join('')}
    <a class='dorar-search-link' href=${dorarSearchLink} target='_blank'>البحث في موقع الدرر السَنية</a>;
  </section>
  `;

  const copyButtons = document.getElementsByClassName('copy-btn');
  for (let btn of copyButtons) {
    btn.addEventListener('click', (e) => {
      const content = e.target.previousElementSibling;
      const text =
        content.innerText +
        '\n\n' +
        `البحث في موقع الدرر السَنية: ${dorarSearchLink}`;

      btn.disabled = true;
      navigator.clipboard.writeText(text).then(
        () => {
          btn.disabled = false;
          console.log('Copying to clipboard was successful!');
        },
        (err) => {
          console.error('Could not copy text: ', err);
        },
      );
    });
  }
};

const setLoader = () => {
  loader.className = 'center';
  content.style.display = 'none';
};

const hideLoader = () => {
  loader.className = 'loader-hide';
  content.style.display = 'block';
};

// It will only run once (when the window is rendering for the first time)
chrome.storage.local.get('text', ({ text }) => {
  currText = text;
  dorarSearchLink = `https://dorar.net/hadith/search?q=${currText}`;

  chrome.storage.local.get('options', async ({ options }) => {
    const query = convertOptionsToQueryString(options);
    currQuery = query;
    setLoader();
    const data = await getHadith(
      query,
      currText,
      currPage,
      currTabId,
    );

    updatePageCounter(currPage);
    updateHadithCounter(data.length);

    if (data.length === 0) {
      showMessage(
        `
        <span>لا توجد أي نتائج</span>
        <span>حاول تحديد نص أخر او جزء أصغر من الحديث</span>
        <br/>
        `,
      );
      hideLoader();
      return;
    }
    updateContent(data);
    showMessage('');
    hideLoader();
  });
});

next.addEventListener('click', async (e) => {
  e.preventDefault();
  currPage += 1;
  setLoader();
  const data = await getHadith(
    currQuery,
    currText,
    currPage,
    currTabId,
  );

  updatePageCounter(currPage);

  if (data.length === 0) {
    currPage -= 1;
    showMessage(
      `
      <span>أنت في الصفحة الأخيرة</span>
      <span>لا توجد أي نتائج أخرى</span>
      <br/>
      `,
    );
    hideLoader();
    updatePageCounter(currPage);
    return;
  }
  updateHadithCounter(data.length);
  updateContent(data);
  showMessage('');
  hideLoader();
});
prev.addEventListener('click', async (e) => {
  e.preventDefault();
  if (currPage === 1) {
    showMessage(
      `
      <span>أنت في الصفحة الأولى بالفعل</span>
      <br/>
      `,
    );
    return;
  }
  currPage -= 1;
  setLoader();
  const data = await getHadith(
    currQuery,
    currText,
    currPage,
    currTabId,
  );
  updatePageCounter(currPage);
  updateHadithCounter(data.length);
  updateContent(data);
  showMessage('');
  hideLoader();
});

// Switching tabs
Array.from(document.getElementsByClassName('tab-btn')).forEach(
  (tabBtn) => {
    tabBtn.addEventListener('click', async (e) => {
      const ele = e.target;

      Array.from(
        document.getElementsByClassName('tab-links'),
      ).forEach((tabLink) =>
        tabLink === e.target
          ? ele.classList.add('active')
          : tabLink.classList.remove('active'),
      );
      currTabId = ele.dataset.tabid;
      if (currTabId !== 'main-tab') settings.style.display = 'none';
      else settings.style.display = 'block';

      content.innerHTML = '';
      setLoader();
      const data = await getHadith(
        currQuery,
        currText,
        currPage,
        currTabId,
      );
      updatePageCounter(currPage);
      updateHadithCounter(data.length);
      if (data.length === 0) {
        showMessage(
          `
          <span>لا توجد أي نتائج في هذا القسم</span>
          <span>اختر قسم أخر</span>
          <br/>
          `,
        );
        hideLoader();
        return;
      }
      updateContent(data);
      showMessage('');
      hideLoader();
    });
  },
);
