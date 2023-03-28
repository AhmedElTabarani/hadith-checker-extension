//for search window
document.querySelector(
  '.searchwindow .toggle-settings .fa-gear',
).onclick = function () {
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
  });
};
//search window
const searchbar = document.querySelector('#searchbar');
const btnSearch = document.querySelector('#search-window-btn');
btnSearch.addEventListener('click', () => {
    if(searchbar.value===''){
        document.querySelector('.err').innerHTML="هذا الحقل مطلوب"
        return false;
    }
  chrome.storage.local.set({ text: searchbar.value }, async () => {
    await chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
    });
  });
});
