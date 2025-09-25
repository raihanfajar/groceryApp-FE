import { Product, Transaction, TransactionProduct } from "../transaction/transactionTypes";

// Dummy Products
export const dummyProduct1: Product = {
  id: "prod-001",
  name: "Wireless Mechanical Keyboard",
  description: "Keyboard mekanikal wireless dengan switch red",
  slug: "wireless-mechanical-keyboard",
  price: 1200000,
  zIndex: 1,
  picture1: "/images/keyboard1.jpg",
  picture2: "/images/keyboard2.jpg",
  picture3: null,
  picture4: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  categoryId: "cat-001",
  isActive: true,
  weight: 0.9,
};

export const dummyProduct2: Product = {
  id: "prod-002",
  name: "Ergonomic Office Chair",
  description: "Kursi kantor ergonomis dengan sandaran kepala",
  slug: "ergonomic-office-chair",
  price: 1500000,
  zIndex: 2,
  picture1: "/images/chair1.jpg",
  picture2: "/images/chair2.jpg",
  picture3: null,
  picture4: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  categoryId: "cat-002",
  isActive: true,
  weight: 12,
};

// Dummy TransactionProducts
export const dummyTransactionProduct1: TransactionProduct = {
  id: "trx-prod-001",
  transactionId: "trx-001",
  productId: dummyProduct1.id,
  quantity: 2,
  price: dummyProduct1.price,
  discount: 100000, // per produk
  finalPrice: (dummyProduct1.price - 100000) * 2, // (1.200.000 - 100.000) * 2
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  productDetails: dummyProduct1,
};

export const dummyTransactionProduct2: TransactionProduct = {
  id: "trx-prod-002",
  transactionId: "trx-001",
  productId: dummyProduct2.id,
  quantity: 1,
  price: dummyProduct2.price,
  discount: 200000,
  finalPrice: dummyProduct2.price - 200000, // 1.500.000 - 200.000
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  productDetails: dummyProduct2,
};

// Dummy Transaction
export const dummyTransaction: Transaction = {
  id: "trx-001",
  userId: "user-123",
  storeId: "store-456",
  status: "waiting_payment",

  totalProductPrice:
    dummyProduct1.price * dummyTransactionProduct1.quantity +
    dummyProduct2.price * dummyTransactionProduct2.quantity, // total harga sebelum diskon
  discountedProductPrice:
    dummyTransactionProduct1.discount * dummyTransactionProduct1.quantity +
    dummyTransactionProduct2.discount * dummyTransactionProduct2.quantity,
  finalProductPrice:
    dummyTransactionProduct1.finalPrice + dummyTransactionProduct2.finalPrice,

  shippingPrice: 20000,
  discountedShipping: 5000,
  finalShippingPrice: 15000,

  totalPrice:
    dummyTransactionProduct1.finalPrice +
    dummyTransactionProduct2.finalPrice +
    15000,

  receiverName: "Raihan Fajar Ramadhan",
  address: "Jl. Sudirman No. 1",
  phoneNumber: "08123456789",
  provinceId: 31,
  province: "DKI Jakarta",
  cityId: 3173,
  city: "Jakarta Selatan",
  districtId: 3173070,
  district: "Kebayoran Baru",
  addressLabel: "Rumah",

  codeVoucherProduct: "PROMOKEYBOARD",
  codeVoucherDelivery: "ONGKIRHEMAT",

  paymentProof: null,
  paymentMethod: "midtrans",
  snapToken: null,
  snapRedirectUrl: null,
  paidAt: null,
  expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,

  productsTransaction: [dummyTransactionProduct1, dummyTransactionProduct2],
};
