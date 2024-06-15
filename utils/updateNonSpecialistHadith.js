const nonspecialistHadith = document.querySelector(
  '#non-specialist-hadith',
);
const nonspecialistHadithCounter =
  nonspecialistHadith.querySelector('span');

export const updateNonSpecialistHadithCounter = (numberOfHadith) =>
  (nonspecialistHadithCounter.innerText = numberOfHadith);

export const hideNonSpecialistHadith = () =>
  (nonspecialistHadith.style.display = 'none');

export const showNonSpecialistHadith = () =>
  (nonspecialistHadith.style.display = 'block');
