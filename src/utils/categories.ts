export const CATEGORIES = [
  'food',
  'travel',
  'office',
  'transport',
  'entertainment',
  'health',
  'utilities',
  'other',
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_ICONS: Record<Category, string> = {
  food: 'restaurant-outline',
  travel: 'airplane-outline',
  office: 'briefcase-outline',
  transport: 'car-outline',
  entertainment: 'film-outline',
  health: 'medkit-outline',
  utilities: 'flash-outline',
  other: 'ellipsis-horizontal-outline',
};
