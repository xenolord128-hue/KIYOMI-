// Utility functions for SEO-friendly URLs and slugs

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars except hyphen
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

// Known category slug mapping for standard URLs
export const CATEGORY_SLUG_MAP: Record<string, string> = {
  'baggy-cargo-pants': 'Baggy & Cargo Pants',
  'baggy-and-cargo-pants': 'Baggy & Cargo Pants',
  'cargo': 'Baggy & Cargo Pants',
  'pants': 'Baggy & Cargo Pants',
  'oversized-tees-polos': 'Oversized Tees & Polos',
  'oversized-tees-and-polos': 'Oversized Tees & Polos',
  't-shirts': 'Oversized Tees & Polos',
  'tees': 'Oversized Tees & Polos',
  'polos': 'Oversized Tees & Polos',
  'hoodies-sweatshirts': 'Hoodies & Sweatshirts',
  'hoodies-and-sweatshirts': 'Hoodies & Sweatshirts',
  'hoodies': 'Hoodies & Sweatshirts',
  'sweatshirts': 'Hoodies & Sweatshirts',
  'womens-collection': "Women's Collection",
  'womens-fashion': "Women's Collection",
  'women': "Women's Collection",
  'accessories-lifestyle': 'Accessories & Lifestyle',
  'accessories-and-lifestyle': 'Accessories & Lifestyle',
  'accessories': 'Accessories & Lifestyle',
  'lifestyle': 'Accessories & Lifestyle',
};

// Extract product ID from slug or numeric ID
export const parseProductId = (param?: string): number | null => {
  if (!param) return null;
  // If param is pure number (e.g. "3")
  if (/^\d+$/.test(param)) {
    return parseInt(param, 10);
  }
  // If param has slug followed by -ID (e.g. "patowary-baggy-cargo-pants-1")
  const match = param.match(/-(\d+)$/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
};

// Generate product URL
export const getProductUrl = (id: number | string, title?: string): string => {
  if (title) {
    const slug = slugify(title);
    return `/product/${slug}-${id}`;
  }
  return `/product/${id}`;
};

// Generate category URL
export const getCategoryUrl = (categoryName: string): string => {
  const slug = slugify(categoryName);
  return `/category/${slug}`;
};
