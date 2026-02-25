/**
 * Parses thematic categories (التصنيف الموضوعي) from a hadith block.
 * Expects links like: <a href="/hadith-category/cat/{id}">{name}</a>
 * @param {Element} container - DOM element that may contain category links
 * @returns {Array<{ id: string, name: string }>}
 */
export function parseHadithCategories(container) {
  if (!container) return [];

  const links = container.querySelectorAll(
    'a[href*="/hadith-category/cat/"]',
  );
  const categories = [];

  for (const link of links) {
    const href = link.getAttribute('href') || '';
    const match = href.match(/\/hadith-category\/cat\/([^/?#]+)/);
    const id = match ? match[1].trim() : null;
    const name = link.textContent.trim();
    if (id && name) {
      categories.push({ id, name });
    }
  }

  return categories;
}
