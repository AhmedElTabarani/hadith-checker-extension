import hadithSearchController from './controllers/hadithSearch.controller.js';
import * as cache from './utils/cache.js';
import { updateHadithCounter } from './utils/updateHadithCounter.js';
import paginationController from './controllers/pagination.controller.js';
import {
  hideSpecialistHadith,
  showSpecialistHadith,
  updateSpecialistHadithCounter,
} from './utils/updateSpecialistHadith.js';
import {
  hideNonSpecialistHadith,
  showNonSpecialistHadith,
  updateNonSpecialistHadithCounter,
} from './utils/updateNonSpecialistHadith.js';
import { updateContent } from './utils/updateContent.js';
import queryOptions from './controllers/queryOptions.controller.js';
import asyncHandler from './utils/asyncHandler.js';
import {
  hideTotalHadith,
  showTotalHadith,
  updateTotalHadithCounter,
} from './utils/updateTotalHadith.js';
import {
  hideNumberOfPages,
  showNumberOfPages,
  updateNumberOfPagesCounter,
} from './utils/updatenumberOfPages.js';

const content = document.getElementById('content');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const pageNumberSelection = document.getElementById(
  'page-number-selection',
);
const goToPage = document.getElementById('go-to-page');
const settings = document.querySelector('.settings-box');
const dorarSearchLink = document.querySelector('.dorar-search-link');
const sunnahSearchLink = document.querySelector(
  '.sunnah-search-link',
);
const specialistToggleBox = document.querySelector('.toggle-box');
const toggleSpecialist = specialistToggleBox.querySelector('.toggle');

let currText = '';
let currTabId = 'main-tab';

// It will only run once (when the window is rendering for the first time)
cache.get('text').then(
  asyncHandler(async (text) => {
    currText = text;
    hadithSearchController.setTabId(currTabId);

    toggleSpecialist.checked = queryOptions.getOption('specialist');
    dorarSearchLink.setAttribute(
      'href',
      `https://dorar.net/hadith/search?q=${currText}`,
    );
    sunnahSearchLink.setAttribute(
      'href',
      `https://sunnah.com/search?q=${currText}`,
    );

    const { data, metadata } = await hadithSearchController.search(
      currText,
    );

    if (currTabId !== 'sunnah-site-tab') {
      const { numberOfNonSpecialist, numberOfSpecialist } = metadata;
      updateNonSpecialistHadithCounter(numberOfNonSpecialist);
      updateSpecialistHadithCounter(numberOfSpecialist);
      showNonSpecialistHadith();
      showSpecialistHadith();
      hideTotalHadith();
      hideNumberOfPages();
      specialistToggleBox.style.display = 'flex';
    } else {
      showTotalHadith();
      showNumberOfPages();
      updateNumberOfPagesCounter(metadata?.numberOfPages || 0);
      updateTotalHadithCounter(metadata?.totalOfHadith || 0);
      hideNonSpecialistHadith();
      hideSpecialistHadith();
      specialistToggleBox.style.display = 'none';
    }

    updateHadithCounter(data?.length || 0);

    if (data.length === 0) {
      throw new Error(
        `
        <span>لا توجد أي نتائج</span>
        <br/>
        <span>حاول تحديد نص أخر او جزء أصغر من الحديث</span>
        <br/>
        `,
      );
    }
    updateContent(data, currTabId);
  }),
);

next.addEventListener(
  'click',
  asyncHandler(async (e) => {
    e.preventDefault();
    paginationController.nextPage();
    const { data } = await hadithSearchController.search(currText);
    updateHadithCounter(data?.length || 0);

    if (data.length === 0) {
      content.innerHTML = '';
      throw new Error(
        `
      <span>لا توجد أي نتائج</span>
      <br/>
      `,
      );
    }
    updateContent(data, currTabId);
  }),
);

prev.addEventListener(
  'click',
  asyncHandler(async (e) => {
    e.preventDefault();
    if (paginationController.getPage() === 1) {
      throw new Error(
        `
      <span>أنت في الصفحة الأولى بالفعل</span>
      <br/>
      `,
      );
    }
    paginationController.prevPage();
    const { data } = await hadithSearchController.search(currText);
    updateHadithCounter(data?.length || 0);

    if (data.length === 0) {
      content.innerHTML = '';
      throw new Error(
        `
      <span>لا توجد أي نتائج</span>
      <br/>
      `,
      );
    }

    updateContent(data, currTabId);
  }),
);

goToPage.addEventListener(
  'click',
  asyncHandler(async (e) => {
    e.preventDefault();
    const page = Math.abs(pageNumberSelection.valueAsNumber);
    paginationController.goToPage(page);
    const { data } = await hadithSearchController.search(currText);
    updateHadithCounter(data?.length || 0);

    if (data.length === 0) {
      content.innerHTML = '';
      throw new Error(
        `
      <span>لا توجد أي نتائج</span>
      <span>أختر صفحة أخرى</span>
      <br/>
      `,
      );
    }
    updateContent(data, currTabId);
  }),
);

const tabButtons = Array.from(
  document.getElementsByClassName('tab-btn'),
);

const switchTab = asyncHandler(async (e) => {
  const clickedTabButton = e.target;

  // Do nothing if clicked the same tab
  if (clickedTabButton.dataset.tabid === currTabId) return;

  currTabId = clickedTabButton.dataset.tabid;
  hadithSearchController.setTabId(currTabId);

  // Update active tab button and inactive the rest
  for (const tabButton of tabButtons) {
    if (tabButton === clickedTabButton)
      tabButton.classList.add('active');
    else tabButton.classList.remove('active');
  }

  // Hide or show settings based on tab selection
  if (currTabId !== 'main-tab') settings.style.display = 'none';
  else settings.style.display = 'block';

  const { data, metadata } = await hadithSearchController.search(
    currText,
  );

  if (currTabId !== 'sunnah-site-tab') {
    const { numberOfNonSpecialist, numberOfSpecialist } = metadata;
    updateNonSpecialistHadithCounter(numberOfNonSpecialist);
    updateSpecialistHadithCounter(numberOfSpecialist);
    showNonSpecialistHadith();
    showSpecialistHadith();
    hideTotalHadith();
    hideNumberOfPages();
    specialistToggleBox.style.display = 'flex';
  } else {
    showTotalHadith();
    showNumberOfPages();
    updateNumberOfPagesCounter(metadata?.numberOfPages || 0);
    updateTotalHadithCounter(metadata?.totalOfHadith || 0);
    hideNonSpecialistHadith();
    hideSpecialistHadith();
    specialistToggleBox.style.display = 'none';
  }

  updateHadithCounter(data?.length || 0);

  if (!data || data.length === 0) {
    content.innerHTML = '';
    throw new Error(
      `
          <span>لا توجد أي نتائج في هذا القسم</span>
          <span>اختر قسم أخر</span>
          <br/>
      `,
    );
  }

  updateContent(data, currTabId);
});

tabButtons.forEach((button) => {
  button.addEventListener('click', switchTab);
});

toggleSpecialist.addEventListener(
  'click',
  asyncHandler(async (e) => {
    const value = e.target.checked;
    queryOptions.updateOption('specialist', value);

    const { data, metadata } = await hadithSearchController.search(
      currText,
    );

    if (currTabId !== 'sunnah-site-tab') {
      const { numberOfNonSpecialist, numberOfSpecialist } = metadata;
      updateNonSpecialistHadithCounter(numberOfNonSpecialist);
      updateSpecialistHadithCounter(numberOfSpecialist);
      showNonSpecialistHadith();
      showSpecialistHadith();
      hideTotalHadith();
      hideNumberOfPages();
      specialistToggleBox.style.display = 'flex';
    } else {
      showTotalHadith();
      showNumberOfPages();
      updateNumberOfPagesCounter(metadata?.numberOfPages || 0);
      updateTotalHadithCounter(metadata?.totalOfHadith || 0);
      hideNonSpecialistHadith();
      hideSpecialistHadith();
      specialistToggleBox.style.display = 'none';
    }

    updateHadithCounter(data?.length || 0);

    if (data.length === 0) {
      content.innerHTML = '';
      throw new Error(
        `
        <span>لا توجد أي نتائج</span>
        <span>أختر فئة أحاديث أخرى</span>
        <br/>
        `,
      );
    }
    updateContent(data, currTabId);
  }),
);
