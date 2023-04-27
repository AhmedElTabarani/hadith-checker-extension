import { convertOptionsToQueryString } from './utils/adapters/convertOptionsToQueryString.js';
import { loadFromStorage } from './utils/adapters/loadFromStorage.js';
import { saveToStorage } from './utils/adapters/saveToStorage.js';
import { getHadith } from './utils/getHadith.js';
import { showMessage } from './utils/sendMessage.js';
import { updateHadithCounter } from './utils/updateHadithCounter.js';
import { updatePageCounter } from './utils/updatePageCounter.js';
import { updateContent } from './utils/updateContent.js';
import { setLoader, hideLoader } from './utils/loader.js';
import { defaultOptions } from './utils/options/defaultOptions.js';

const content = document.getElementById('content');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const settings = document.querySelector('.settings-box');
const dorarSearchLink = document.querySelector('.dorar-search-link');

let currPage = 1;
let currText = '';
let currQuery = '';
let currTabId = 'main-id';

// It will only run once (when the window is rendering for the first time)
loadFromStorage('text').then(async (text) => {
  currText = text;

  let options = await loadFromStorage('options');
  if (!options) {
    await saveToStorage({ options: defaultOptions });
    options = defaultOptions;
  }
  const query = convertOptionsToQueryString(options);
  currQuery = query;

  dorarSearchLink.setAttribute(
    'href',
    `https://dorar.net/hadith/search?q=${currText}&${currQuery}`,
  );

  setLoader();
  const data = await getHadith(currText, currPage, query, currTabId);

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

next.addEventListener('click', async (e) => {
  e.preventDefault();
  currPage += 1;
  setLoader();
  const data = await getHadith(
    currText,
    currPage,
    currQuery,
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
    currText,
    currPage,
    currQuery,
    currTabId,
  );
  updatePageCounter(currPage);
  updateHadithCounter(data.length);
  updateContent(data);
  showMessage('');
  hideLoader();
});

const tabButtons = Array.from(
  document.getElementsByClassName('tab-btn'),
);

const switchTab = async (e) => {
  const clickedTabButton = e.target;
  currTabId = clickedTabButton.dataset.tabid;

  // Update active tab button and inactive the rest
  tabButtons.forEach((tabButton) => {
    if (tabButton === clickedTabButton)
      tabButton.classList.add('active');
    else tabButton.classList.remove('active');
  });

  // Hide or show settings based on tab selection
  if (currTabId !== 'main-tab') settings.style.display = 'none';
  else settings.style.display = 'block';

  setLoader();
  const data = await getHadith(
    currText,
    currPage,
    currQuery,
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
    content.innerHTML = '';
    return;
  }
  updateContent(data);
  showMessage('');
  hideLoader();
};

tabButtons.forEach((button) => {
  button.addEventListener('click', switchTab);
});
