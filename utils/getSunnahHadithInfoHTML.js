export default (hadith) => {
  const englishHadith = hadith
    .querySelector('.text_details')
    ?.innerHTML.trim();

  const englishFullHadith = hadith
    .querySelector('.english_hadith_full')
    ?.innerHTML.trim();

  const englishGrade = hadith
    .querySelector('.english_grade')
    ?.nextElementSibling.innerHTML.trim();

  const arabicHadith = hadith
    .querySelector('.arabic_text_details')
    ?.innerHTML.trim();

  const arabicFullHadith = hadith
    .querySelector('.arabic_hadith_full')
    ?.innerHTML.trim();

  const arabicGrade = hadith
    .querySelector('.arabic_grade')
    ?.innerHTML.trim();

  const englishHadithNarrated = hadith
    .querySelector('.hadith_narrated')
    ?.innerHTML.trim();

  const arabicHadithNarrated = hadith
    .querySelector('.arabic_sanad')
    ?.innerHTML.trim();

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
