export const saveToStorage = (objectToSave) =>
  new Promise((resolve, reject) =>
    chrome.storage.local.set(objectToSave, resolve),
  );
