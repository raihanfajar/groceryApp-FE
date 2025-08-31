import * as FaIcons from "react-icons/fa";

// Category Model
export interface Category {
    name: string;
    icon: keyof typeof FaIcons;
    subcategories: string[];
}

// Props for Category Component
export interface CategoryProps {
    items: Category[];
    onClick?: () => void;
}

// Carousel Model
export interface CarouselItem {
    image: string;
    alt: string;
    link: string;
}

// Props for Carousel Component
export interface CarouselProps {
    items: CarouselItem[];
    onclick?: () => void;
}

// Navigation Button Props
export interface NavButtonProps {
    direction: "left" | "right";
    onClick?: () => void;
}

// Product Model
export interface Product {
    id: number;
    image: string;
    name: string;
    category: string;
    price: number;
    discount?: number;
}

// Props for Product List Component
export interface ProductProps {
    items: Product[];
    name: "Recommended Product" | "Latest Product";
}

// Props for Product Card Component (reuse Product minus 'id')
export interface ProductCardProps extends Omit<Product, "id"> {
    onClick?: () => void; // optional extra functionality
}
