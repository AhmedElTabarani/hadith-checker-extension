//show
document.querySelector(".toggle-settings .fa-gear").onclick = function () {
    this.classList.toggle("fa-spin");
    document.querySelector(".settings-box").classList.toggle("open");
    
  };
const selectedm = document.querySelector(".mohdethen .selected");
const optionsContainerm = document.querySelector(".mohdethen .options-container");
const searchBoxm = document.querySelector(".mohdethen .search-box input");
const optionsListm = document.querySelectorAll(".mohdethen .option");

const selectedb = document.querySelector(".book .selected");
const optionsContainerb = document.querySelector(".book  .options-container");
const searchBoxb = document.querySelector(".book .search-box input");
const optionsListb = document.querySelectorAll(".book .option");

selectedm.addEventListener("click", () => {
  optionsContainerm.classList.toggle("active");

  searchBoxm.value = "";
  filterList("");

  if (optionsContainerm.classList.contains("active")) {
    searchBoxm.focus();
  }
});
selectedb.addEventListener("click", () => {
  optionsContainerb.classList.toggle("active");

  searchBoxb.value = "";
  filterListb("");

  if (optionsContainerb.classList.contains("active")) {
    searchBoxb.focus();
  }
});
optionsListm.forEach(o => {
  o.addEventListener("click", () => {
    selectedm.innerHTML = o.querySelector("label").innerHTML;
    optionsContainerm.classList.remove("active");
  });
});
optionsListb.forEach(o => {
  o.addEventListener("click", () => {
    selectedb.innerHTML = o.querySelector("label").innerHTML;
    optionsContainerb.classList.remove("active");
  });
});
searchBoxm.addEventListener("keyup", function(e) {
  filterList(e.target.value);
});
searchBoxb.addEventListener("keyup", function(e) {
  filterListb(e.target.value);
});
const filterList = searchTerm => {
  searchTerm = searchTerm.toLowerCase();
  optionsListm.forEach(option => {
    let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    if (label.indexOf(searchTerm) != -1) {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  });
};
const filterListb = searchTerm => {
  searchTerm = searchTerm.toLowerCase();
  optionsListm.forEach(option => {
    let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    if (label.indexOf(searchTerm) != -1) {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  });
};
