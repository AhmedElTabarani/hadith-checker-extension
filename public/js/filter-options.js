import { allBooks } from '../../utils/data/allBooks.js';
import { allMohdith } from '../../utils/data/allMohdith.js';
import { hadithDegree } from '../../utils/data/hadithDegree.js';
import { searchZone } from '../../utils/data/searchZone.js';
import { allRawi } from '../../utils/data/allRawi.js';
import { searchMethod } from '../../utils/data/searchMethod.js';
import queryOptions from '../../controllers/queryOptions.controller.js';

const hadithDegreeElement = document.querySelector('#hadith-degree');
const searchZoneElement = document.querySelector('#search-zone');
const bookElement = document.querySelector('#book');
const mohdithElement = document.querySelector('#mohdith');
const rawiElement = document.querySelector('#rawi');
const searchMethodElement = document.querySelector('#search-method');
const ignoreWordsElement = document.querySelector('#ignore-words');

const settings = document.querySelector('.toggle-settings');

ignoreWordsElement.value = queryOptions.getOption('ignoreWords');

const addOrRemoveRedDot = (option, element) => {
  const isChanged = queryOptions.isChanged(option, true);
  isChanged
    ? element.parentElement.classList.add('red-dot')
    : element.parentElement.classList.remove('red-dot');
};

queryOptions.isChanged()
  ? settings.classList.add('red-dot')
  : settings.classList.remove('red-dot');

addOrRemoveRedDot('ignoreWords', ignoreWordsElement);
addOrRemoveRedDot('hadithDegree', hadithDegreeElement);
addOrRemoveRedDot('searchZone', searchZoneElement);
addOrRemoveRedDot('book', bookElement);
addOrRemoveRedDot('mohdith', mohdithElement);
addOrRemoveRedDot('rawi', rawiElement);
addOrRemoveRedDot('searchMethod', searchMethodElement);

document.querySelector('.main .toggle-settings .fa-gear').onclick =
  function () {
    this.classList.toggle('fa-spin');
    document.querySelector('.settings-box').classList.toggle('open');
  };

VirtualSelect.init({
  ele: '#hadith-degree',
  options: hadithDegree,
  selectedValue: queryOptions.getOption('hadithDegree'),
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
  selectedValue: queryOptions.getOption('searchZone'),
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
  selectedValue: queryOptions.getOption('book'),
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
  selectedValue: queryOptions.getOption('mohdith'),
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
  selectedValue: queryOptions.getOption('rawi'),
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
  selectedValue: queryOptions.getOption('searchMethod'),
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
  queryOptions.updateOption('hadithDegree', this.value);
});

searchZoneElement.addEventListener('change', function (e) {
  queryOptions.updateOption('searchZone', this.value);
});

bookElement.addEventListener('change', function (e) {
  queryOptions.updateOption('book', this.value);
});

mohdithElement.addEventListener('change', function (e) {
  queryOptions.updateOption('mohdith', this.value);
});

rawiElement.addEventListener('change', function (e) {
  queryOptions.updateOption('rawi', this.value);
});

searchMethodElement.addEventListener('change', function (e) {
  queryOptions.updateOption('searchMethod', this.value);
});

ignoreWordsElement.addEventListener('change', function () {
  queryOptions.updateOption('ignoreWords', this.value);
});

const form = document.getElementById('option-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await queryOptions.saveOptions();
  window.location.reload();
});

document
  .getElementById('reset-option-btn')
  .addEventListener('click', async () => {
    await queryOptions.resetOptions();
    window.location.reload();
  });
