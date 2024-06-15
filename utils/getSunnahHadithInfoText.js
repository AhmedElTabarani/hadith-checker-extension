export default (hadith) => {
  const englishHadith = hadith
    .querySelector('.text_details')
    ?.textContent.trim();

  const englishFullHadith = hadith
    .querySelector('.english_hadith_full')
    ?.textContent.trim();

  const englishGrade = hadith
    .querySelector('.english_grade')
    ?.nextElementSibling.textContent.trim();

  const arabicHadith = hadith
    .querySelector('.arabic_text_details')
    ?.textContent.trim();

  const arabicFullHadith = hadith
    .querySelector('.arabic_hadith_full')
    ?.textContent.trim();

  const arabicGrade = hadith
    .querySelector('.arabic_grade')
    ?.textContent.trim();

  const englishHadithNarrated = hadith
    .querySelector('.hadith_narrated')
    ?.textContent.trim();

  const arabicHadithNarrated = hadith
    .querySelector('.arabic_sanad')
    ?.textContent.trim();

  return {
    englishHadith,
    englishHadithNarrated,
    englishFullHadith,
    englishGrade,
    arabicHadithNarrated,
    arabicHadith,
    arabicFullHadith,
    arabicGrade,
  };
};
