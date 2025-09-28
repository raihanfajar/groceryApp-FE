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
  useUserAddressesQuery,
  useUserCartQuery,
} from "@/hooks/checkout/getCheckoutData";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const page = () => {
  const [productVoucher, setProductVoucher] = useState<Voucher | null>(null);
  const [deliveryVoucher, setDeliveryVoucher] = useState<Voucher | null>(null);
  const [selectedAddress, setSelectedAddress] =
    useState<UserAddressInterface | null>(null);
  const router = useRouter();

  const { data: addressData = [], isLoading: isLoadingAddress } =
    useUserAddressesQuery();

  const { data: cartData, isLoading: isLoadingCart } = useUserCartQuery();
  const itemsAvailable = cartData?.items?.every(
    (item) => item.availability.status === "AVAILABLE",
  );

  useEffect(() => {
    if (!addressData || addressData.length === 0) return;
    const defaultAddress =
      addressData.find((a) => a.isDefault) ?? addressData[0];
    setSelectedAddress(defaultAddress);
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

  if (!itemsAvailable) {
    toast.error("No items available in cart");
    router.push("/cart");
  }

  if (isLoadingAddress || isLoadingCart) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4 text-center">
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
        <div className="border-lg mb-7 w-full rounded-lg border border-black bg-[#f5f5f5] p-4">
          {cartData?.items &&
            cartData.items
              .filter((item) => item.availability.status === "AVAILABLE")
              .map((singleItem) => (
                <CartUser key={singleItem.id} item={singleItem} />
              ))}
        </div>
        <div className="mb-5 flex w-full flex-col gap-4 rounded-lg p-4 md:flex-row md:items-start md:justify-between">
          <div className="w-full rounded-lg border border-black p-5 md:w-[55%]">
            <VoucherCheckout onVoucherApplied={handleVoucherApply} />
          </div>

          <div className="w-full md:flex md:w-[40%] md:justify-end">
            <div className="w-full rounded-lg border border-black p-5">
              <CheckoutSummary
                userAddress={selectedAddress}
                productVoucher={productVoucher}
                deliveryVoucher={deliveryVoucher}
                product={
                  cartData?.items?.filter(
                    (item) => item.availability.status === "AVAILABLE",
                  ) ?? []
                }
              />
            </div>
          </div>
        </div>
      </section>
    </UserAuthGuard>
  );
};

export default page;
