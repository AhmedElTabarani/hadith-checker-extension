import { allBooks } from '../../utils/data/allBooks.js';
import { allMohdith } from '../../utils/data/allMohdith.js';
import { hadithDegree } from '../../utils/data/hadithDegree.js';
import { searchZone } from '../../utils/data/searchZone.js';
import { allRawi } from '../../utils/data/allRawi.js';
import { searchMethod } from '../../utils/data/searchMethod.js';
import { defaultOptions } from '../../utils/options/defaultOptions.js';
import { loadFromStorage } from '../../utils/adapters/loadFromStorage.js';
import { saveToStorage } from '../../utils/adapters/saveToStorage.js';

loadFromStorage('options').then(async (options) => {
  if (!options) {
    await saveToStorage({ options: defaultOptions });
    options = defaultOptions;
  }

  document.querySelector('.main .toggle-settings .fa-gear').onclick =
    function () {
      this.classList.toggle('fa-spin');
      document
        .querySelector('.settings-box')
        .classList.toggle('open');
    };

  VirtualSelect.init({
    ele: '#hadith-degree',
    options: hadithDegree,
    selectedValue: options.hadithDegreeSelected.value,
    search: false,
    multiple: true,
    markSearchResults: true,
    showSelectedOptionsFirst: true,
    keepAlwaysOpen: true,
    dropboxWidth: '250px',
    textDirection: 'rtl',
  });

  VirtualSelect.init({
    ele: '#search-zone',
    options: searchZone,
    selectedValue: options.searchZoneSelected.value,
    search: false,
    multiple: false,
    placeholder: 'اختر نطاق البحث',
    dropboxWidth: '100%',
    popupDropboxBreakpoint: '3000px',
    textDirection: 'rtl',
  });

  VirtualSelect.init({
    ele: '#book',
    options: allBooks,
    selectedValue: options.bookSelected.value,
    search: true,
    multiple: true,
    markSearchResults: true,
    showSelectedOptionsFirst: true,
    placeholder: 'ابحث في الكتب',
    searchPlaceholderText: 'ابحث',
    optionsSelectedText: 'قيم تم تحديدها',
    optionSelectedText: 'قيمة تم تحديدها',
    noSearchResultsText: 'لم يتم العثور نتائج',
    dropboxWidth: '100%',
    popupDropboxBreakpoint: '3000px',
    textDirection: 'rtl',
  });

  VirtualSelect.init({
    ele: '#mohdith',
    options: allMohdith,
    selectedValue: options.mohdithSelected.value,
    search: true,
    multiple: true,
    markSearchResults: true,
    showSelectedOptionsFirst: true,
    placeholder: 'ابحث في المحدثين',
    searchPlaceholderText: 'ابحث',
    optionsSelectedText: 'قيم تم تحديدها',
    optionSelectedText: 'قيمة تم تحديدها',
    noSearchResultsText: 'لم يتم العثور نتائج',
    dropboxWidth: '100%',
    popupDropboxBreakpoint: '3000px',
    textDirection: 'rtl',
  });

  VirtualSelect.init({
    ele: '#rawi',
    options: allRawi,
    selectedValue: options.rawiSelected.value,
    search: true,
    multiple: true,
    markSearchResults: true,
    showSelectedOptionsFirst: true,
    placeholder: 'ابحث في الرواة',
    searchPlaceholderText: 'ابحث',
    optionsSelectedText: 'قيم تم تحديدها',
    optionSelectedText: 'قيمة تم تحديدها',
    noSearchResultsText: 'لم يتم العثور نتائج',
    dropboxWidth: '100%',
    popupDropboxBreakpoint: '3000px',
    textDirection: 'rtl',
  });

  VirtualSelect.init({
    ele: '#search-method',
    selectedValue: options.searchMethodSelected.value,
    options: searchMethod,
    search: false,
    multiple: false,
    placeholder: 'تحديد طريقة البحث',
    searchPlaceholderText: 'ابحث',
    dropboxWidth: '100%',
    popupDropboxBreakpoint: '3000px',
    textDirection: 'rtl',
  });

  document
    .querySelector('#hadith-degree')
    .addEventListener('change', function (e) {
      let selectedOptions = e.target.getSelectedOptions();
      options.hadithDegreeSelected = {
        id: 'd[]',
        key: 'درجة الحديث',
        value: this.value,
        labels: selectedOptions,
      };
    });
  document
    .querySelector('#search-zone')
    .addEventListener('change', function (e) {
      let selectedOptions = e.target.getSelectedOptions();
      options.searchZoneSelected = {
        id: 't',
        key: 'نطاق الحديث',
        value: this.value,
        labels: selectedOptions,
      };
    });
  document
    .querySelector('#book')
    .addEventListener('change', function (e) {
      let selectedOptions = e.target.getSelectedOptions();
      options.bookSelected = {
        id: 's[]',
        key: 'الكتاب',
        value: this.value,
        labels: selectedOptions,
      };
    });
  document
    .querySelector('#mohdith')
    .addEventListener('change', function (e) {
      let selectedOptions = e.target.getSelectedOptions();
      options.mohdithSelected = {
        id: 'm[]',
        key: 'المحدث',
        value: this.value,
        labels: selectedOptions,
      };
    });
  document
    .querySelector('#rawi')
    .addEventListener('change', function (e) {
      let selectedOptions = e.target.getSelectedOptions();
      options.rawiSelected = {
        id: 'rawi[]',
        key: 'الراوي',
        value: this.value,
        labels: selectedOptions,
      };
    });
  document
    .querySelector('#search-method')
    .addEventListener('change', function (e) {
      let selectedOptions = e.target.getSelectedOptions();
      options.searchMethodSelected = {
        id: 'st',
        key: 'طريقة البحث',
        value: this.value,
        labels: selectedOptions,
      };
    });
  document
    .querySelector('#notget')
    .addEventListener('change', function () {
      options.ignoreWordSelected = {
        id: 'xclude',
        key: 'كلمة أو جملة مستبعدة',
        value: this.value,
      };
    });

  const form = document.getElementById('option-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    chrome.storage.local.set({ options: options }, () => {
      window.location.reload();
    });
  });
});

document
  .getElementById('reset-option-btn')
  .addEventListener('click', async () => {
    await saveToStorage({ options: defaultOptions });
    window.location.reload();
  });
