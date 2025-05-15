/**
 * Generates a URL-friendly slug from a given string.
 *
 * Converts the input string to lowercase, replaces spaces with hyphens,
 * and removes all non-alphanumeric characters except hyphens and underscores.
 *
 * @param {string} title - The input string to convert.
 * @returns {string} The generated slug.
 */

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};