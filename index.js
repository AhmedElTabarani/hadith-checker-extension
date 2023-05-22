import { loadFromStorage } from './utils/adapters/loadFromStorage.js';
import { getHadith } from './utils/getHadith.js';
import { showMessage } from './utils/sendMessage.js';
import { updateHadithCounter } from './utils/updateHadithCounter.js';
import { updatePageCounter } from './utils/updatePageCounter.js';
import { updateSpecialistHadithCounter } from './utils/updateSpecialistHadithCounter.js';
import { updateNonSpecialistHadithCounter } from './utils/updateNonSpecialistHadithCounter.js';
import { updateContent } from './utils/updateContent.js';
import { setLoader, hideLoader } from './utils/loader.js';
import queryOptions from './controllers/queryOptions.controller.js';

const content = document.getElementById('content');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const settings = document.querySelector('.settings-box');
const dorarSearchLink = document.querySelector('.dorar-search-link');
const toggleSpecialist = document.querySelector(
  '.toggle-box .toggle',
);

let currPage = 1;
let currText = '';
let currTabId = 'main-tab';

// It will only run once (when the window is rendering for the first time)
loadFromStorage('text').then(async (text) => {
  currText = text;

  toggleSpecialist.checked = queryOptions.getOption('specialist');
  dorarSearchLink.setAttribute(
    'href',
    `https://dorar.net/hadith/search?q=${currText}`,
  );

  setLoader();
  const { data, metadata } = await getHadith(
    currText,
    currPage,
    currTabId,
  );

  const { numberOfNonSpecialist, numberOfSpecialist } = metadata;
  updateNonSpecialistHadithCounter(numberOfNonSpecialist);
  updateSpecialistHadithCounter(numberOfSpecialist);

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
  const { data } = await getHadith(currText, currPage, currTabId);

  updatePageCounter(currPage);

  if (data.length === 0) {
    currPage -= 1;
    showMessage(
      `
      <span>أنت في الصفحة الأخيرة بالفعل</span>
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
  const { data } = await getHadith(currText, currPage, currTabId);
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

  // Do nothing if clicked the same tab
  if (clickedTabButton.dataset.tabid === currTabId) return;

  currTabId = clickedTabButton.dataset.tabid;

  // Update active tab button and inactive the rest
  for (const tabButton of tabButtons) {
    if (tabButton === clickedTabButton)
      tabButton.classList.add('active');
    else tabButton.classList.remove('active');
  }

  // Hide or show settings based on tab selection
  if (currTabId !== 'main-tab') settings.style.display = 'none';
  else settings.style.display = 'block';

  setLoader();
  const { data, metadata } = await getHadith(
    currText,
    currPage,
    currTabId,
  );

  const { numberOfNonSpecialist, numberOfSpecialist } = metadata;
  updateNonSpecialistHadithCounter(numberOfNonSpecialist);
  updateSpecialistHadithCounter(numberOfSpecialist);

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

toggleSpecialist.addEventListener('click', async (e) => {
  const value = e.target.checked;
  queryOptions.updateOption('specialist', value);

  setLoader();
  const { data, metadata } = await getHadith(
    currText,
    currPage,
    currTabId,
  );

  const { numberOfNonSpecialist, numberOfSpecialist } = metadata;
  updateNonSpecialistHadithCounter(numberOfNonSpecialist);
  updateSpecialistHadithCounter(numberOfSpecialist);

  updatePageCounter(currPage);
  updateHadithCounter(data.length);

  if (data.length === 0) {
    showMessage(
      `
        <span>لا توجد أي نتائج</span>
        <span>أختر فئة أحاديث أخرى</span>
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
