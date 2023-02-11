//import
import { allBooks } from './utils/allBooks.js';
import { allMohdith } from './utils/allMohdith.js';
import { hadithDegree } from './utils/hadithDegree.js';
import { searchZone } from './utils/searchZone.js';
import { Elrawi } from './utils/Elrawi.js';
import { searchMethod } from './utils/searchMethod.js';
//show setting box
document.querySelector('.toggle-settings .fa-gear').onclick =
  function () {
    this.classList.toggle('fa-spin');
    document.querySelector('.settings-box').classList.toggle('open');
  };
//select hadithDegree
VirtualSelect.init({
  ele: '#hadith-degree',
  options: hadithDegree,
  search: false,
  multiple: true,
  dropboxWidth: '250px',
  keepAlwaysOpen: true,
  textDirection: 'rtl',
});
//select searchZone
VirtualSelect.init({
  ele: '#search-zone',
  options: searchZone,
  search: false, 
  multiple: false,
  dropboxWidth: '100%',
  placeholder: 'اختر نطاق البحث',
  textDirection: 'rtl',
  popupDropboxBreakpoint:"3000px"
});
//select books
VirtualSelect.init({
  ele: '#book',
  options: allBooks,
  search: true,
  multiple: true,
  placeholder: 'ابحث في الكتب',
  searchPlaceholderText: 'ابحث',
  dropboxWidth: '100%',
  textDirection: 'rtl',
  popupDropboxBreakpoint:"3000px"
});   
//select mohdith
VirtualSelect.init({
  ele: '#mohdith',
  options: allMohdith,
  search: true,
  multiple: true,
  placeholder: 'ابحث في المحدثين',
  searchPlaceholderText: 'ابحث',
  dropboxWidth: '100%',
  textDirection: 'rtl',
  popupDropboxBreakpoint:"3000px"
});
//select Elrawi
VirtualSelect.init({
  ele: '#rawi',
  options: Elrawi,
  search: true,
  multiple: true,
  placeholder: 'ابحث في الرواه',
  searchPlaceholderText: 'ابحث',
  dropboxWidth: '100%',
  textDirection: 'rtl',
  popupDropboxBreakpoint:"3000px"
});
//select search method
VirtualSelect.init({
  ele: '#search-method',
  options: searchMethod,
  search: false,
  multiple: false,
  placeholder: 'تحديد طريقة البحث',
  searchPlaceholderText: 'ابحث',
  dropboxWidth: '100%',
  textDirection: 'rtl',
  popupDropboxBreakpoint:"3000px"
});

//get selected value
let bookSelected = '';
let mohdithSelected = '';
let searchZoneSelected = '';
let hadithDegreeSelected = '';
let rawiSelected = '';
let searchMethodSelected = '';
let ignoreWordSelected = '';
document
  .querySelector('#mohdith')
  .addEventListener('change', function () {
    bookSelected = {
      id: 'm[]',
      value: this.value,
    };
  });
document
  .querySelector('#book')
  .addEventListener('change', function () {
    mohdithSelected = {
      id: 's[]',
      value: this.value,
    };
  });
document
  .querySelector('#hadith-degree')
  .addEventListener('change', function () {
    hadithDegreeSelected = {
      id:'d[]',
      value:this.value
    };
  });
document
  .querySelector('#search-zone')
  .addEventListener('change', function () {
    searchZoneSelected = {
      id:'t',
      value:this.value
    };
  });
  document
  .querySelector('#rawi')
  .addEventListener('change', function () {
    rawiSelected = {
      id: 'rawi[]',
      value: this.value,
    };
  });
  document
  .querySelector('#search-method')
  .addEventListener('change', function () {
    searchMethodSelected = {
      id: 'st',
      value: this.value,
    };
  });
  document
  .querySelector('#notget')
  .addEventListener('change', function () {
    console.log(this.value);
    ignoreWordSelected = {
      id: 'xclude',
      value: this.value,
    };
  });
// submit form
let form = document.getElementById('myForm');
const handleSubmit = (e) => {
  e.preventDefault();
  console.log(mohdithSelected);
  console.log(bookSelected);
  console.log(searchZoneSelected)
  console.log(hadithDegreeSelected)
  console.log(rawiSelected)
  console.log(searchMethodSelected)
  console.log(ignoreWordSelected)
};
form.addEventListener('submit', handleSubmit);
