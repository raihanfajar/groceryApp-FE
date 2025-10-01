export const slugToTitle = (slug: string): string => {
    const smallWords = ["in", "to", "of", "on", "at", "by", "for", "with", "a", "an", "the"];

    return slug
        .split("-")
        .map((word, index) => {
            if (index !== 0 && smallWords.includes(word)) {
                return word; // keep small words lowercase unless first word
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
};

export const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");