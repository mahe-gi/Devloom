export function generateSlug(title) {
    // Convert text to lowercase, replace spaces with hyphens, remove non-alphanumeric chars
    let slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    // Prevent numeric-only slugs
    if (/^\d+$/.test(slug)) {
        slug = `article-${slug}`;
    }
    // Never produce an empty slug (fallback for unsupported titles like emojis only)
    if (!slug) {
        slug = "article";
    }
    return slug;
}
export function generateRandomSuffix() {
    return Math.random().toString(36).substring(2, 6);
}
