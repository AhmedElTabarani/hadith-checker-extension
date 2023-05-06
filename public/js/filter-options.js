import { allBooks } from '../../utils/data/allBooks.js';
import { allMohdith } from '../../utils/data/allMohdith.js';
import { hadithDegree } from '../../utils/data/hadithDegree.js';
import { searchZone } from '../../utils/data/searchZone.js';
import { allRawi } from '../../utils/data/allRawi.js';
import { searchMethod } from '../../utils/data/searchMethod.js';
import { defaultOptions } from '../../utils/options/defaultOptions.js';
import { loadFromStorage } from '../../utils/adapters/loadFromStorage.js';
import { saveToStorage } from '../../utils/adapters/saveToStorage.js';

const hadithDegreeElement = document.querySelector('#hadith-degree');
const searchZoneElement = document.querySelector('#search-zone');
const bookElement = document.querySelector('#book');
const mohdithElement = document.querySelector('#mohdith');
const rawiElement = document.querySelector('#rawi');
const searchMethodElement = document.querySelector('#search-method');
const ignoreWordsElement = document.querySelector('#ignore-words');

loadFromStorage('options').then(async (options) => {
  if (!options) {
    await saveToStorage('options', defaultOptions);
    options = defaultOptions;
  }

  ignoreWordsElement.value = options.ignoreWordSelected.value;

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

  hadithDegreeElement.addEventListener('change', function (e) {
    let selectedOptions = e.target.getSelectedOptions();
    options.hadithDegreeSelected = {
      id: 'd[]',
      key: 'درجة الحديث',
      value: this.value,
      labels: selectedOptions,
    };
  });

  searchZoneElement.addEventListener('change', function (e) {
    let selectedOptions = e.target.getSelectedOptions();
    options.searchZoneSelected = {
      id: 't',
      key: 'نطاق الحديث',
      value: this.value,
      labels: selectedOptions,
    };
  });

  bookElement.addEventListener('change', function (e) {
    let selectedOptions = e.target.getSelectedOptions();
    options.bookSelected = {
      id: 's[]',
      key: 'الكتاب',
      value: this.value,
      labels: selectedOptions,
    };
  });

  mohdithElement.addEventListener('change', function (e) {
    let selectedOptions = e.target.getSelectedOptions();
    options.mohdithSelected = {
      id: 'm[]',
      key: 'المحدث',
      value: this.value,
      labels: selectedOptions,
    };
  });

  rawiElement.addEventListener('change', function (e) {
    let selectedOptions = e.target.getSelectedOptions();
    options.rawiSelected = {
      id: 'rawi[]',
      key: 'الراوي',
      value: this.value,
      labels: selectedOptions,
    };
  });

  searchMethodElement.addEventListener('change', function (e) {
    let selectedOptions = e.target.getSelectedOptions();
    options.searchMethodSelected = {
      id: 'st',
      key: 'طريقة البحث',
      value: this.value,
      labels: selectedOptions,
    };
  });

  ignoreWordsElement.addEventListener('change', function () {
    options.ignoreWordSelected = {
      id: 'xclude',
      key: 'كلمة أو جملة مستبعدة',
      value: this.value,
    };
  });

  const form = document.getElementById('option-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveToStorage('options', options);
    window.location.reload();
  });
});

document
  .getElementById('reset-option-btn')
  .addEventListener('click', async () => {
    await saveToStorage('options', defaultOptions);
    window.location.reload();
  });
