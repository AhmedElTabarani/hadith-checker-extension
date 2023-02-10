//import
import { allBooks } from "./utils/allBooks.js";
import { allMohdith } from "./utils/allMohdith.js"; 
//show setting box
document.querySelector('.toggle-settings .fa-gear').onclick =
  function () {
    this.classList.toggle('fa-spin');
    document.querySelector('.settings-box').classList.toggle('open');
  };
//select books
VirtualSelect.init({
  ele: '#book', 
  options: allBooks,  
  search: true,
  multiple: true,
  placeholder: 'ابحث في الكتب',
  searchPlaceholderText: 'ابحث', 
  dropboxWidth: '203px',
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
});
//get selected value
let bookSelected=''
let mohdithSelected=''
document
  .querySelector('#mohdith')
  .addEventListener('change', function () {
     bookSelected=this.value
  });
  document
  .querySelector('#book')
  .addEventListener('change', function () {
    mohdithSelected=this.value
  });
 // submit form
let form = document.getElementById("myForm");
  const handleSubmit=(e)=>{ 
    e.preventDefault();
    console.log(mohdithSelected)
    console.log(bookSelected)
  }
  form.addEventListener('submit', handleSubmit)
