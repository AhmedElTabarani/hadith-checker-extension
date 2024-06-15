const numberOfPages = document.querySelector('#number-of-pages');
const numberOfPagesCounter = numberOfPages.querySelector('span');

export const updateNumberOfPagesCounter = (numberOfHadith) =>
  (numberOfPagesCounter.innerText = numberOfHadith);

export const hideNumberOfPages = () =>
  (numberOfPages.style.display = 'none');

export const showNumberOfPages = () =>
  (numberOfPages.style.display = 'block');
