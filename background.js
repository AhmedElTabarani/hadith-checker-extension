import { saveToStorage } from './utils/adapters/saveToStorage.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'التحقق من الحديث | Check Hadith',
    id: 'check-hadith',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  await saveToStorage({ text: info.selectionText });
  await chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
  });
});
