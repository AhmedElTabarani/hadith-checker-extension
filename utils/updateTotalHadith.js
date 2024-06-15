const totalHadith = document.querySelector('#total-hadith');
const totalHadithCounter = totalHadith.querySelector('span');

export const updateTotalHadithCounter = (numberOfHadith) =>
  (totalHadithCounter.innerText = numberOfHadith);

export const hideTotalHadith = () =>
  (totalHadith.style.display = 'none');

export const showTotalHadith = () =>
  (totalHadith.style.display = 'block');
