/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if needed
 */
export function generateUniqueSlug(
  baseText: string,
  existingSlugs: string[] = [],
): string {
  let slug = generateSlug(baseText);
  let counter = 1;
  const originalSlug = slug;

  while (existingSlugs.includes(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Generate slug from category name for client-side use
 * This is a temporary solution until the backend migration is complete
 */
export function getCategorySlug(categoryName: string): string {
  return generateSlug(categoryName);
}
