const content = document.getElementById('content');
const popupCard = document.getElementById('popup-card');
const loader = document.getElementById('loader');
const loaderPopup = document.getElementById('loader-popup');

export const hideLoader = () => {
  loader.className = 'loader-hide';
  content.style.display = 'block';
};

export const setLoader = () => {
  loader.className = 'center';
  content.style.display = 'none';
};

export const hidePopupLoader = () => {
  loaderPopup.className = 'loader-hide';
  popupCard.style.display = 'block';
};

export const setPopupLoader = () => {
  loaderPopup.className = 'center';
  popupCard.style.display = 'none';
};
