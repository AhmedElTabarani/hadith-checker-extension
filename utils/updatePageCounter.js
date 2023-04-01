const pageCounter = document.querySelector('#page-counter span');

export const updatePageCounter = (
  page = +pageCounter.innerText || 1,
) => (pageCounter.innerText = page);
