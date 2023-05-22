const nonspecialistHadith = document.querySelector(
  '#non-specialist-hadith span',
);

export const updateNonSpecialistHadithCounter = (numberOfHadith) =>
  (nonspecialistHadith.innerText = numberOfHadith);
