import {
  Apple,
  Carrot,
  Package,
  Milk,
  Beef,
  Fish,
  Utensils,
  ChefHat,
  Cookie,
  Croissant,
  Coffee,
  Wheat,
  Cake,
  Snowflake,
  Heart,
  Stethoscope,
  Sparkles,
  Baby,
  MoreHorizontal,
} from "lucide-react";

export interface CategoryIcon {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  color: string; // For visual differentiation
}

export const CATEGORY_ICONS: CategoryIcon[] = [
  {
    id: "apple",
    name: "Fruits",
    icon: Apple,
    description: "Fresh fruits and berries",
    color: "text-red-500",
  },
  {
    id: "carrot",
    name: "Vegetables",
    icon: Carrot,
    description: "Fresh vegetables and greens",
    color: "text-orange-500",
  },
  {
    id: "package",
    name: "Canned Goods",
    icon: Package,
    description: "Canned and packaged foods",
    color: "text-gray-600",
  },
  {
    id: "milk",
    name: "Dairy",
    icon: Milk,
    description: "Milk, cheese, yogurt and dairy products",
    color: "text-blue-400",
  },
  {
    id: "beef",
    name: "Meat",
    icon: Beef,
    description: "Fresh and processed meat products",
    color: "text-red-700",
  },
  {
    id: "fish",
    name: "Fish & Seafood",
    icon: Fish,
    description: "Fresh fish and seafood",
    color: "text-blue-600",
  },
  {
    id: "utensils",
    name: "Deli",
    icon: Utensils,
    description: "Deli meats and prepared foods",
    color: "text-yellow-600",
  },
  {
    id: "chef-hat",
    name: "Condiments & Spices",
    icon: ChefHat,
    description: "Spices, sauces and condiments",
    color: "text-green-600",
  },
  {
    id: "cookie",
    name: "Snacks",
    icon: Cookie,
    description: "Chips, crackers and snack foods",
    color: "text-amber-500",
  },
  {
    id: "croissant",
    name: "Bread & Bakery",
    icon: Croissant,
    description: "Fresh bread and baked goods",
    color: "text-yellow-700",
  },
  {
    id: "coffee",
    name: "Beverages",
    icon: Coffee,
    description: "Drinks, juices and beverages",
    color: "text-brown-600",
  },
  {
    id: "wheat",
    name: "Pasta, Rice & Cereal",
    icon: Wheat,
    description: "Grains, pasta and cereals",
    color: "text-yellow-800",
  },
  {
    id: "cake",
    name: "Baking",
    icon: Cake,
    description: "Baking supplies and ingredients",
    color: "text-pink-500",
  },
  {
    id: "snowflake",
    name: "Frozen Foods",
    icon: Snowflake,
    description: "Frozen meals and ingredients",
    color: "text-cyan-500",
  },
  {
    id: "heart",
    name: "Personal Care",
    icon: Heart,
    description: "Personal hygiene and care products",
    color: "text-pink-600",
  },
  {
    id: "stethoscope",
    name: "Health Care",
    icon: Stethoscope,
    description: "Health and wellness products",
    color: "text-green-700",
  },
  {
    id: "sparkles",
    name: "Household & Cleaning Supplies",
    icon: Sparkles,
    description: "Cleaning and household products",
    color: "text-purple-600",
  },
  {
    id: "baby",
    name: "Baby Items",
    icon: Baby,
    description: "Baby food, diapers and care products",
    color: "text-blue-300",
  },
  {
    id: "more-horizontal",
    name: "Misc.",
    icon: MoreHorizontal,
    description: "Miscellaneous items",
    color: "text-gray-500",
  },
];

// Helper function to get icon by id
export const getIconById = (iconId: string): CategoryIcon | undefined => {
  return CATEGORY_ICONS.find((icon) => icon.id === iconId);
};

// Helper function to get icon component by id
export const getIconComponent = (
  iconId: string,
): React.ComponentType<{ size?: number; className?: string }> | undefined => {
  const iconData = getIconById(iconId);
  return iconData?.icon;
};

// Helper function to get default icon
export const getDefaultIcon = (): CategoryIcon => {
  return CATEGORY_ICONS[CATEGORY_ICONS.length - 1]; // Return "Misc." as default
};
