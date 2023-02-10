//import
import { allBooks } from './utils/allBooks.js';
import { allMohdith } from './utils/allMohdith.js';
import { hadithDegree } from './utils/hadithDegree.js';
import { searchZone } from './utils/searchZone.js';
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
  multiple: true,
  maxValues:1,
  dropboxWidth: '250px',
  textDirection: 'rtl',
  keepAlwaysOpen: true,
});
//select books
VirtualSelect.init({
  ele: '#book',
  options: allBooks,
  search: true,
  multiple: true,
  placeholder: 'ابحث في الكتب',
  searchPlaceholderText: 'ابحث',
  dropboxWidth: '203px',
  textDirection: 'rtl',
});
//select mohdith
VirtualSelect.init({
  ele: '#mohdith',
  options: allMohdith,
  search: true,
  multiple: true,
  placeholder: 'ابحث في المحدثين',
  searchPlaceholderText: 'ابحث',
  dropboxWidth: '203px',
  textDirection: 'rtl',
});
//get selected value
let bookSelected = '';
let mohdithSelected = '';
let searchZoneSelected = '';
let hadithDegreeSelected = '';
document
  .querySelector('#mohdith')
  .addEventListener('change', function () {
    bookSelected = {
      id: 'm[]',
      values: this.value,
    };
  });
document
  .querySelector('#book')
  .addEventListener('change', function () {
    mohdithSelected = {
      id: 's[]',
      values: this.value,
    };
  });
document
  .querySelector('#hadith-degree')
  .addEventListener('change', function () {
    hadithDegreeSelected = {
      id:'d[]',
      values:this.value
    };
  });
document
  .querySelector('#search-zone')
  .addEventListener('change', function () {
    searchZoneSelected = {
      id:'t',
      values:this.value
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
};
form.addEventListener('submit', handleSubmit);
