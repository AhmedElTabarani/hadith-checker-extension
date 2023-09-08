import * as cache from '../../utils/cache.js';

const searchbar = document.querySelector('#searchbar');
const btnSearch = document.querySelector('#search-window-btn');
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
