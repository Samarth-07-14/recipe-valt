export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  familyMember: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  image?: string; // base64 or URL
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  notes?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export type RecipeCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Dessert'
  | 'Snack'
  | 'Appetizer'
  | 'Soup'
  | 'Salad'
  | 'Baked Goods'
  | 'Drinks'
  | 'Other';

export const CATEGORIES: RecipeCategory[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Appetizer',
  'Soup',
  'Salad',
  'Baked Goods',
  'Drinks',
  'Other',
];

export const CATEGORY_EMOJIS: Record<RecipeCategory, string> = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Dessert: '🍰',
  Snack: '🍿',
  Appetizer: '🥗',
  Soup: '🍲',
  Salad: '🥙',
  'Baked Goods': '🥖',
  Drinks: '🍹',
  Other: '🍽️',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#10b981',
  Medium: '#f59e0b',
  Hard: '#ef4444',
};
