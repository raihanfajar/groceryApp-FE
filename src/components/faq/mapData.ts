import { ClientQuestionType, Topic } from "./typesAndInterfaces";

// !ClientQuestion
export const clientQuestions: ClientQuestionType[] = [
    {
        topic: "application",
        questions: [
            {
                question: "Product Information",
                answer: [
                    "Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.",
                    "Key features include advanced processing capabilities, and an intuitive user interface designed for both beginners and experts.",
                ],
            },
            {
                question: "How do I update the app?",
                answer: [
                    "Go to your device's app store and check for updates.",
                    "Ensure you are connected to Wi-Fi for a smooth update process.",
                ],
            },
        ],
    },
    {
        topic: "how-to-shop",
        questions: [
            {
                question: "How do I place an order?",
                answer: [
                    "Browse our catalog and add items to your cart.",
                    "Proceed to checkout and follow the steps to complete your purchase.",
                ],
            },
            {
                question: "Can I cancel my order?",
                answer: [
                    "Yes, orders can be canceled within 1 hour of placing them.",
                    "Go to 'My Orders' and click on 'Cancel Order' if eligible.",
                ],
            },
        ],
    },
    {
        topic: "shipping",
        questions: [
            {
                question: "What are the shipping options?",
                answer: [
                    "We offer standard and express shipping options.",
                    "Delivery times vary based on your location and chosen method.",
                ],
            },
            {
                question: "Can I track my order?",
                answer: [
                    "Yes, you can track your order using the tracking number provided via email.",
                    "Tracking is available in the 'My Orders' section of your account.",
                ],
            },
        ],
    },
    {
        topic: "free-delivery",
        questions: [
            {
                question: "Is free delivery available?",
                answer: [
                    "Free delivery is available for orders above $50.",
                    "The offer applies to standard shipping only.",
                ],
            },
            {
                question: "Are there any exclusions?",
                answer: [
                    "Yes, some oversized items may not qualify for free delivery.",
                    "Check the product details page for eligibility.",
                ],
            },
        ],
    },
    {
        topic: "pickup-in-store",
        questions: [
            {
                question: "Can I pick up my order in store?",
                answer: [
                    "Yes, you can choose in-store pickup at checkout.",
                    "You will receive a notification when your order is ready.",
                ],
            },
            {
                question: "Is pickup free?",
                answer: [
                    "Yes, in-store pickup is completely free of charge.",
                    "Ensure you bring a valid ID when collecting your order.",
                ],
            },
        ],
    },
    {
        topic: "payment",
        questions: [
            {
                question: "Accepted Payment Methods",
                answer: [
                    "We accept credit/debit cards, PayPal, and bank transfers.",
                    "All transactions are encrypted and secure.",
                ],
            },
            {
                question: "Can I pay with cash?",
                answer: [
                    "Cash on Delivery is available in select regions only.",
                    "Check at checkout if this option is available for you.",
                ],
            },
        ],
    },
    {
        topic: "refund",
        questions: [
            {
                question: "What is your refund policy?",
                answer: [
                    "We offer a 30-day refund policy for eligible items.",
                    "Items must be returned in their original condition.",
                ],
            },
            {
                question: "How long does a refund take?",
                answer: [
                    "Refunds are processed within 5-7 business days after approval.",
                    "Time may vary depending on your bank or payment provider.",
                ],
            },
        ],
    },
    {
        topic: "membership",
        questions: [
            {
                question: "How do I become a member?",
                answer: [
                    "Sign up on our website and choose a membership plan.",
                    "Membership comes with exclusive perks and discounts.",
                ],
            },
            {
                question: "Is there a membership fee?",
                answer: [
                    "Basic membership is free, but premium plans have a monthly fee.",
                    "Check our membership page for more details.",
                ],
            },
        ],
    },
    {
        topic: "points",
        questions: [
            {
                question: "How do I earn points?",
                answer: [
                    "You earn points on every purchase you make.",
                    "Special promotions allow you to earn bonus points.",
                ],
            },
            {
                question: "How can I redeem points?",
                answer: [
                    "Points can be redeemed at checkout for discounts.",
                    "100 points = $1 discount on your order.",
                ],
            },
        ],
    },
    {
        topic: "star-program",
        questions: [
            {
                question: "What is the Star Program?",
                answer: [
                    "Our Star Program rewards loyal customers with exclusive benefits.",
                    "Earn stars on every purchase and unlock rewards.",
                ],
            },
            {
                question: "How do I join the program?",
                answer: [
                    "Join for free by signing up on our loyalty page.",
                    "Stars are added to your account automatically with purchases.",
                ],
            },
        ],
    },
    {
        topic: "stamp",
        questions: [
            {
                question: "How does the stamp system work?",
                answer: [
                    "Collect stamps with each purchase to redeem rewards.",
                    "Every 10 stamps = 1 free item from the rewards menu.",
                ],
            },
            {
                question: "Do stamps expire?",
                answer: [
                    "Yes, stamps expire after 12 months from the date of earning.",
                    "Check your account dashboard for expiry details.",
                ],
            },
        ],
    },
    {
        topic: "voucher",
        questions: [
            {
                question: "How do I use a voucher?",
                answer: [
                    "Enter your voucher code at checkout to apply the discount.",
                    "Only one voucher can be used per order.",
                ],
            },
            {
                question: "Can vouchers be combined?",
                answer: [
                    "No, vouchers cannot be combined with other discounts.",
                    "Some vouchers have minimum purchase requirements.",
                ],
            },
        ],
    },
    {
        topic: "gift",
        questions: [
            {
                question: "Do you offer gift wrapping?",
                answer: [
                    "Yes, you can select gift wrapping at checkout for an additional fee.",
                    "Gift wrapping includes a card for a personalized message.",
                ],
            },
            {
                question: "Can I buy a gift card?",
                answer: [
                    "Yes, gift cards are available in multiple denominations.",
                    "Gift cards can be sent digitally or as a physical card.",
                ],
            },
        ],
    },
];

// !Topics
export const topics: Topic[] = [
    { title: "Application", icon: "FaMobileAlt", slug: "application" },
    { title: "How to Shop", icon: "FaShoppingCart", slug: "how-to-shop" },
    { title: "Shipping", icon: "FaTruck", slug: "shipping" },
    { title: "Free Delivery", icon: "FaShippingFast", slug: "free-delivery" },
    { title: "Pickup in Store", icon: "FaStore", slug: "pickup-in-store" },
    { title: "Payment", icon: "FaCreditCard", slug: "payment" },
    { title: "Refund", icon: "FaUndoAlt", slug: "refund" },
    { title: "Membership", icon: "FaUserFriends", slug: "membership" },
    { title: "Points", icon: "FaCoins", slug: "points" },
    { title: "Star Program", icon: "FaStar", slug: "star-program" },
    { title: "Stamp", icon: "FaStamp", slug: "stamp" },
    { title: "Voucher", icon: "FaTicketAlt", slug: "voucher" },
    { title: "Gift", icon: "FaGift", slug: "gift" },
];