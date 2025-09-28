import { CartItemWithPromo } from "../cart/getUserCart";
import { Voucher } from "../voucher/voucherInterface";

export interface UserAddressInterface {
  id: string;
  addressLabel: string;
  userId: string;
  receiverName: string;
  receiverPhoneNumber: string;
  addressDisplayName: string;
  addressDetails: string;
  lat: string;
  lon: string;
  isDefault: boolean;
  province: string;
  city: string;
  district: string;
  districtId: number;
}

export interface CreateTransactionInput {
  userAddressId: string;
  storeId: string;
  shippingPrice: number;
  paymentMethod: "manual_transfer" | "midtrans";
  productVoucher?: string;
  deliveryVoucher?: string;
}

export type CheckoutSummaryProps = {
  userAddress: UserAddressInterface | null;
  productVoucher: Voucher | null;
  deliveryVoucher: Voucher | null;
  product: CartItemWithPromo[];
}

export interface TransactionResponse {
  message: string;
  data: {
    transaction: Transaction;
    outOfStockItems: CartProduct[];
    paymentDetails: {
      token: string;
      redirect_url: string;
    } | null;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  weight: number | null;
}

export interface CartProduct {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Transaction {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
}