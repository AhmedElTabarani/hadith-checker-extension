const specialistHadith = document.querySelector('#specialist-hadith');
const specialistHadithCounter =
  specialistHadith.querySelector('span');

export const updateSpecialistHadithCounter = (numberOfHadith) =>
  (specialistHadithCounter.innerText = numberOfHadith);

export const hideSpecialistHadith = () =>
  (specialistHadith.style.display = 'none');

export const showSpecialistHadith = () =>
  (specialistHadith.style.display = 'block');
