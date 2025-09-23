"use client";

import UserAuthGuard from "@/providers/UserAuthGuard";
import React, { useEffect, useState } from "react";
import UserAddress from "./components/UserAddress";
import CartUser from "./components/CartUser";
import VoucherCheckout from "./components/VoucherCheckout";
import { Voucher } from "@/types/voucher/voucherInterface";
import { UserAddressInterface } from "@/types/checkout/checkoutTypes";
import CheckoutSummary from "./components/CheckoutSummary";
import CheckoutHeading from "./components/CheckoutHeading";
import {
  useUserAddressQuery,
  useUserCartQuery,
} from "@/hooks/checkout/getCheckoutData";

const page = () => {
  const [productVoucher, setProductVoucher] = useState<Voucher | null>(null);
  const [deliveryVoucher, setDeliveryVoucher] = useState<Voucher | null>(null);
  const [selectedAddress, setSelectedAddress] =
    useState<UserAddressInterface | null>(null);

  const { data: addressData, isLoading: isLoadingAddress } =
    useUserAddressQuery();
  const { data: cartData, isLoading: isLoadingCart } = useUserCartQuery();

  useEffect(() => {
    if (addressData) {
      setSelectedAddress(addressData);
    }
  }, [addressData]);

  const handleAddressChange = (newAddress: UserAddressInterface) => {
    setSelectedAddress(newAddress);
  };

  const handleVoucherApply = (voucherData: Voucher) => {
    if (
      voucherData.code.toLowerCase().includes("ship") ||
      voucherData.code.toLowerCase().includes("delivery")
    ) {
      setDeliveryVoucher(voucherData);
    } else {
      setProductVoucher(voucherData);
    }
  };

  let addressList: UserAddressInterface[] = [];

  if (addressData) {
    if (Array.isArray(addressData)) {
      addressList = addressData;
    } else {
      addressList = [addressData];
    }
  }

  if (isLoadingAddress || isLoadingCart) {
    return (
      <div className="container mx-auto p-4 text-center">
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <UserAuthGuard>
      <section className="container mx-auto p-4">
        <CheckoutHeading />
        <UserAddress
          addresses={addressList}
          selectedAddress={selectedAddress}
          onAddressChange={handleAddressChange}
        />
        <div className="mb-5 h-auto w-full rounded-lg bg-[#f5f5f5] p-3">
          {cartData?.items?.map((singleItem) => (
            <CartUser key={singleItem.id} item={singleItem} />
          ))}
        </div>
        <div className="mb-5 flex w-full flex-col gap-4 rounded-lg bg-[#f5f5f5] p-4 md:flex-row md:items-start md:justify-between">
          <div className="w-full md:w-[60%]">
            <VoucherCheckout onVoucherApplied={handleVoucherApply} />
          </div>

          <div className="w-full md:flex md:w-[40%] md:justify-end">
            <div className="w-full">
              <CheckoutSummary
                userAddress={selectedAddress}
                productVoucher={productVoucher}
                deliveryVoucher={deliveryVoucher}
                product={cartData?.items ?? []}
              />
            </div>
          </div>
        </div>
      </section>
    </UserAuthGuard>
  );
};

export default page;
