const specialistHadith = document.querySelector(
  '#specialist-hadith span',
);

export const updateSpecialistHadithCounter = (numberOfHadith) =>
  (specialistHadith.innerText = numberOfHadith);
