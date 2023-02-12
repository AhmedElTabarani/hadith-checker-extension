//import
import { allBooks } from './utils/allBooks.js';
import { allMohdith } from './utils/allMohdith.js';
import { hadithDegree } from './utils/hadithDegree.js';
import { searchZone } from './utils/searchZone.js';
import { Elrawi } from './utils/Elrawi.js';
import { searchMethod } from './utils/searchMethod.js';
import { defaultOptions } from './utils/defaultOptions.js';

chrome.storage.local.get('options', async ({ options }) => {
  if (!options) {
    await chrome.storage.local.set({ options: defaultOptions });
    options = defaultOptions;
  }

  document.querySelector('.toggle-settings .fa-gear').onclick =
    function () {
      this.classList.toggle('fa-spin');
      document
        .querySelector('.settings-box')
        .classList.toggle('open');
    };

  //select hadithDegree
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

  //select searchZone
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

  //select books
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

  //select mohdith
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

  //select Elrawi
  VirtualSelect.init({
    ele: '#rawi',
    options: Elrawi,
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

  //select search method
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
    .addEventListener('change', function () {
      options.hadithDegreeSelected = {
        id: 'd[]',
        value: this.value,
      };
    });
  document
    .querySelector('#search-zone')
    .addEventListener('change', function () {
      options.searchZoneSelected = {
        id: 't',
        value: this.value,
      };
    });
  document
    .querySelector('#book')
    .addEventListener('change', function () {
      options.bookSelected = {
        id: 's[]',
        value: this.value,
      };
    });
  document
    .querySelector('#mohdith')
    .addEventListener('change', function () {
      options.mohdithSelected = {
        id: 'm[]',
        value: this.value,
      };
    });
  document
    .querySelector('#rawi')
    .addEventListener('change', function () {
      options.rawiSelected = {
        id: 'rawi[]',
        value: this.value,
      };
    });
  document
    .querySelector('#search-method')
    .addEventListener('change', function () {
      options.searchMethodSelected = {
        id: 'st',
        value: this.value,
      };
    });
  document
    .querySelector('#notget')
    .addEventListener('change', function () {
      options.ignoreWordSelected = {
        id: 'xclude',
        value: this.value,
      };
    });

  //select ignore word method

  // submit form
  const form = document.getElementById('option-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    chrome.storage.local.set({ options: options }, () => {
      window.location.reload();
    });
  });
});
