import { Benefits, CarouselItem, Category, MenuSection, Product } from "./typesAndInterfaces";

export const categories: Category[] = [
    {
        name: "Kitchen Essentials",
        icon: "FaUtensils",
        subcategories: [
            "Kitchen & Dining Supplies",
            "Cooking Ingredients",
            "Baking Supplies",
            "Pudding & Jelly Mixes"
        ],
    },
    {
        name: "Mom & Baby Essentials",
        icon: "FaBaby",
        subcategories: [
            "Baby & Kids Food",
            "Infant Formula",
            "Baby Bath & Care",
            "Maternity & Nursing Milk",
            "Diapers",
            "Baby Laundry & Cleaning Products",
            "Baby Feeding Accessories",
            "Other Mom & Baby Needs"
        ],
    },
    {
        name: "Home Essentials",
        icon: "FaHome",
        subcategories: [
            "Bathroom Supplies",
            "Cleaning Products",
            "Household Items",
            "Tissues",
            "Air Fresheners & Moisture Absorbers",
            "Pest & Insect Control"
        ],
    },
    {
        name: "Food",
        icon: "FaHamburger",
        subcategories: [
            "Snacks",
            "Instant Meals",
            "Bread, Spreads & Cereal"
        ],
    },
    {
        name: "Beverages",
        icon: "FaCoffee",
        subcategories: [
            "Soft Drinks",
            "Dairy Products",
            "Instant Beverages"
        ],
    },
    {
        name: "Fresh & Frozen",
        icon: "FaSnowflake",
        subcategories: [
            "Ready-to-Eat Meals",
            "Ready-to-Drink Beverages",
            "Fresh Produce",
            "Frozen Food",
            "Ice Cream",
            "Packaged Food"
        ],
    },
    {
        name: "Personal Care",
        icon: "FaSpa",
        subcategories: [
            "Makeup & Hair Tools",
            "Body Care",
            "Men's Grooming",
            "Hair Care",
            "Skincare",
            "Cosmetics",
            "Feminine Care & Adult Diapers",
            "Oral Care",
            "Fragrances"
        ],
    },
    {
        name: "Health",
        icon: "FaHeartbeat",
        subcategories: [
            "Medicine",
            "Vitamins & Supplements",
            "Medical Devices",
            "Hygiene Products"
        ],
    },
    {
        name: "Lifestyle",
        icon: "FaGamepad",
        subcategories: [
            "Toys & Entertainment",
            "Fashion",
            "Office & School Supplies",
            "Automotive Accessories",
            "Cigarettes & Lighters"
        ],
    },
    {
        name: "Pet Supplies",
        icon: "FaPaw",
        subcategories: [
            "Dog Food",
            "Cat Food",
            "Other Pet Food"
        ],
    },
];

export const carouselItems: CarouselItem[] = [
    {
        image: "/promoCarousel/gate.jpg",
        alt: "Superwings Payday",
        link: "#",
    },
    {
        image: "/promoCarousel/gate.jpg",
        alt: "Loyalty Member Alfatar",
        link: "#",
    },
    {
        image: "/promoCarousel/gate.jpg",
        alt: "Promo Special",
        link: "#",
    },
];

export const dummyRecommendedProducts: Product[] = [
    {
        id: 1,
        image: "/productList/exampleProduct.png",
        name: "Fruit Tea Minuman Teh Freeze 350 ml",
        category: "Mom & Baby Essentials",
        price: 4400,
        discount: 0.15,
    },
    {
        id: 2,
        image: "/productList/exampleProduct.png",
        name: "Tehbotol Sosro Minuman Teh Original 350 ml",
        category: "Teh Botol",
        price: 4400,
        discount: 0.09,
    },
    {
        id: 3,
        image: "/productList/exampleProduct.png",
        name: "Nestle Pure Life Air Mineral Botol 600 ml",
        category: "Air Mineral",
        price: 3900,
    },
    {
        id: 4,
        image: "/productList/exampleProduct.png",
        name: "Fruit Tea Minuman Teh Blackcurrant 350 ml",
        category: "Minuman Teh",
        price: 4400,
    },
    {
        id: 5,
        image: "/productList/exampleProduct.png",
        name: "Nestle Pure Life Air Mineral Botol 1.5 L",
        category: "Air Mineral",
        price: 6900,
    },
    {
        id: 6,
        image: "/productList/exampleProduct.png",
        name: "Happy Tos Keripik Tortilla Merah 140 g",
        category: "Keripik Tortilla",
        price: 11400,
    },
    {
        id: 7,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 8,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 9,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 10,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 11,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 12,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 13,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 14,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1 Ada Dua Line Karena Panjang Sekali Sampe Line-clamped",
        category: "Snack",
        price: 8500,
    },
    {
        id: 15,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1",
        category: "Snack",
        price: 8500,
    },
    {
        id: 16,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1 Ada Dua Line Karena Panjang Sekali Sampe Line-clamped",
        category: "Snack",
        price: 8500,
    },
    {
        id: 17,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1 Ada Dua Line Karena Panjang Sekali Sampe Line-clamped",
        category: "Snack",
        price: 8500,
    },
    {
        id: 18,
        image: "/productList/exampleProduct.png",
        name: "Extra Item Contoh 1 Ada Dua Line Karena Panjang Sekali Sampe Line-clamped",
        category: "Snack",
        price: 8500,
    },
];

export const benefitBannerBenefits: Benefits[] = [
    {
        id: 1,
        image: "/benefitBanner/1.png",
        title: "Free Delivery",
        description: "Enjoy free delivery on all orders within 10 km from our nearest store to your location—no extra cost, no hidden fees.",
    },
    {
        id: 2,
        image: "/benefitBanner/3.png",
        title: "Same-Day Delivery",
        description: "Need it fast? Get your groceries delivered the same day for all orders within a 5 km radius. Fresh and quick, right to your door.",
    },
    {
        id: 3,
        image: "/benefitBanner/5.png",
        title: "Best Prices Guaranteed",
        description: "Our prices are backed by government subsidies, giving you an instant 10% discount on every purchase.",
    },
    {
        id: 4,
        image: "/benefitBanner/7.png",
        title: "Farm-Fresh Produce",
        description: "We guarantee freshness. All our produce is sourced daily and delivered within 24 hours of harvest for maximum quality and taste.",
    },
    {
        id: 5,
        image: "/benefitBanner/9.png",
        title: "24/7 Customer Support",
        description: "Got an issue? Our dedicated support team is available 24/7 to help with delivery, payment, or product concerns—anytime you need us.",
    },
];

// !MenuDrawer MOBILE
export const menuSections: MenuSection[] = [
    {
        title: "My Account",
        items: [
            { label: "Transactions (dev)", href: "#", icon: "MdOutlineReceiptLong" },
        ],
    },
    {
        title: "Main",
        items: [
            { label: "Brand (Bonus)", href: "#", icon: "MdOutlineBrandingWatermark" },
            { label: "Promo (dev)", href: "#", icon: "MdOutlineDiscount" },
            { label: "All Category (dev)", href: "#", icon: "MdOutlineGridView" },
        ],
    },
    {
        title: "Customer Service",
        items: [
            { label: "FAQ", href: "/faq", icon: "MdOutlineQuestionAnswer" },
            {
                label: "How to Shop",
                href: "/faq/how-to-shop",
                icon: "MdOutlineQuestionMark",
            },
        ],
    },
    {
        title: "Discover FreshNear",
        items: [
            { label: "About FreshNear", href: "/about", icon: "MdOutlineInfo" },
            {
                label: "Terms & Conditions",
                href: "/terms",
                icon: "MdOutlineDocumentScanner",
            },
            { label: "Privacy Policy", href: "/privacy", icon: "MdOutlinePrivacyTip" },
            { label: "Career (Bonus)", href: "#", icon: "MdOutlinePeople" },
        ],
    },
    {
        title: "Contact Us",
        items: [
            {
                label: "fnsupport@gmail.com",
                href: "mailto:fnsupport@gmail.com",
                icon: "MdOutlineEmail",
            },
            { label: "666-666-666", href: "tel:666-666-666", icon: "MdOutlinePhone" },
        ],
    },
];