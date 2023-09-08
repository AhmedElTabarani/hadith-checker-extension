import * as cache from '../../utils/cache.js';

const searchbar = document.querySelector('#searchbar');
const btnSearch = document.querySelector('#search-window-btn');

searchbar.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    btnSearch.click();
  }
});

btnSearch.addEventListener('click', async () => {
  if (searchbar.value === '') {
    document.querySelector('.err').innerHTML = 'هذا الحقل مطلوب';
    return;
  }
  await cache.set('text', searchbar.value);
  await chrome.windows.create({
    url: chrome.runtime.getURL('index.html'),
    type: 'popup',
  });
});
