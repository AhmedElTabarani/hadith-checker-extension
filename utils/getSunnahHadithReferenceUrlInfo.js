export default (
  collectionId,
  bookId,
  hadithNumberInBook,
  hadithNumberInCollection,
) => {
  bookId = bookId === '-1' ? 'introduction' : bookId;

  return {
    collectionId,
    bookId,
    hadithNumberInBook,
    hadithNumberInCollection,
    api: {
      hadith: hadithNumberInCollection
        ? `/v1/site/collections/${collectionId}/hadith/${hadithNumberInCollection}`
        : undefined,
      book: bookId
        ? `/v1/site/collections/${collectionId}/books/${bookId}`
        : undefined,
      hadithInBook:
        hadithNumberInBook && bookId
          ? `/v1/site/collections/${collectionId}/books/${bookId}/hadith/${hadithNumberInBook}`
          : undefined,
    },
    sunnahWebsite: {
      hadith: hadithNumberInCollection
        ? `https://sunnah.com/${collectionId}:${hadithNumberInCollection}`
        : undefined,
      collection: `https://sunnah.com/${collectionId}`,
      book: bookId
        ? `https://sunnah.com/${collectionId}/${bookId}`
        : undefined,
      hadithInBook:
        hadithNumberInBook && bookId
          ? `https://sunnah.com/${collectionId}/${bookId}/${hadithNumberInBook}`
          : undefined,
    },
  };
};
