import * as cache from './utils/cache.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'التحقق من الحديث | Check Hadith',
    id: 'check-hadith',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  await cache.set('text', info.selectionText);
  const popupWindow = await chrome.windows.create({
    url: chrome.runtime.getURL('index.html'),
    type: 'popup',
  });

  chrome.windows.onRemoved.addListener(async (windowId) =>
    windowId === popupWindow.id ? await cache.clear() : null,
  );
});
