const content = document.getElementById('content');
const loader = document.getElementById('loader');

export const hideLoader = () => {
  loader.className = 'loader-hide';
  content.style.display = 'block';
};

export const setLoader = () => {
  loader.className = 'center';
  content.style.display = 'none';
};
