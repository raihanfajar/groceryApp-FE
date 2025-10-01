import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

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

export interface MegaMenuProps {
    isOpen: boolean;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    activeCategory: string | null;
    setActiveCategory: (category: string) => void;
}

// Carousel Model
export interface CarouselItem {
    image: string;
    alt: string;
    link: string;
    title: string;
    description: string;
    period: string;
    details: string[];
}

// Props for Carousel Component
export interface CarouselProps {
    items: CarouselItem[];
    onclick?: () => void;
}

// Navigation Button Props
export interface NavButtonProps {
    direction: "left" | "right";
    size?: "sm" | "md" | "lg"; // props-nya
    onClick?: () => void;
}

// Product Model
export interface Product {
    id: string | number;
    image: string;
    name: string;
    category: string;
    price: number;
    discount?: number;
    stock?: number;
    slug: string;
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

export interface Benefits {
    id: number;
    image: string;
    title: string;
    description: string;
}

// !MenuDrawer.tsx
export interface MenuItem {
    label: string;
    href: string;
    icon: keyof typeof MdIcons; // because you are passing icons
}

export interface MenuSection {
    title: string;
    items: MenuItem[];
}

// !AddNewAddressDialog.tsx
export type AddNewAddressDialogFormValues = {
    addressLabel: string;
    receiverName: string;
    receiverPhoneNumber: string;
    latLon: { lat: number; lon: number };
    addressDetails: string;
    isDefault: boolean;
    provinceId: string;
    cityId: string;
    districtId: string;
    province: string;
    city: string;
    district: string;
};

export interface AddNewAddressDialogRequest {
    addressLabel: string;
    receiverName: string;
    receiverPhoneNumber: string;
    lat: number;
    lon: number;
    addressDetails: string;
    isDefault: boolean;
    provinceId: string;
    cityId: string;
    districtId: string;
    province: string;
    city: string;
    district: string;
}