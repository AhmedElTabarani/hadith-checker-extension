const hadithCounter = document.querySelector('#hadith-counter span');

export const updateHadithCounter = (numberOfHadith) =>
  (hadithCounter.innerText = numberOfHadith);
