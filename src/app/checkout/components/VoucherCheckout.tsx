"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { getProductVoucher } from "@/hooks/voucher/getVoucher";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Voucher } from "@/types/voucher/voucherInterface";

type VoucherStatusProps = {
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  hasData: boolean;
  code: string;
};

type VoucherCheckoutProps = {
  onProductVoucherChange: (voucher: Voucher | null) => void;
  onDeliveryVoucherChange: (voucher: Voucher | null) => void;
};

function VoucherCheckout({
  onProductVoucherChange,
  onDeliveryVoucherChange,
}: VoucherCheckoutProps) {
  const [productVoucherCode, setProductVoucherCode] = useState("");
  const [deliveryVoucherCode, setDeliveryVoucherCode] = useState("");

  const debouncedProductCode = useDebounce(productVoucherCode, 500);
  const debouncedDeliveryCode = useDebounce(deliveryVoucherCode, 500);

  const {
    data: voucherProductData,
    isFetching: isProductVoucherFetching,
    isError: isProductVoucherError,
    isSuccess: isProductVoucherSuccess,
  } = useQuery({
    queryKey: ["productVoucher", debouncedProductCode],
    queryFn: () => getProductVoucher(debouncedProductCode),
    enabled: !!debouncedProductCode,
    retry: false,
  });

  const {
    data: voucherDeliveryData,
    isFetching: isDeliveryVoucherFetching,
    isError: isDeliveryVoucherError,
    isSuccess: isDeliveryVoucherSuccess,
  } = useQuery({
    queryKey: ["deliveryVoucher", debouncedDeliveryCode],
    queryFn: () => getProductVoucher(debouncedDeliveryCode),
    enabled: !!debouncedDeliveryCode,
    retry: false,
  });

  useEffect(() => {
    if (isProductVoucherSuccess && voucherProductData) {
      onProductVoucherChange(voucherProductData);
    } else if (
      !isProductVoucherFetching &&
      (isProductVoucherError || !voucherProductData)
    ) {
      onProductVoucherChange(null);
    }
  }, [
    isProductVoucherSuccess,
    voucherProductData,
    onProductVoucherChange,
    isProductVoucherFetching,
    isProductVoucherError,
  ]);

  useEffect(() => {
    if (isDeliveryVoucherSuccess && voucherDeliveryData) {
      onDeliveryVoucherChange(voucherDeliveryData);
    } else if (
      !isDeliveryVoucherFetching &&
      (isDeliveryVoucherError || !voucherDeliveryData)
    ) {
      onDeliveryVoucherChange(null);
    }
  }, [
    isDeliveryVoucherSuccess,
    voucherDeliveryData,
    onDeliveryVoucherChange,
    isDeliveryVoucherFetching,
    isDeliveryVoucherError,
  ]);

  const VoucherStatus = ({
    isFetching,
    isSuccess,
    isError,
    hasData,
    code,
  }: VoucherStatusProps) => {
    if (!code) return null;
    if (isFetching)
      return (
        <div className="mt-2 text-sm text-gray-500">Checking voucher...</div>
      );
    if (isSuccess && hasData)
      return (
        <div className="mt-2 text-sm text-green-600">
          Voucher applied successfully!
        </div>
      );
    if (isError || (isSuccess && !hasData))
      return (
        <div className="mt-2 text-sm text-red-500">
          Voucher is not valid or not found.
        </div>
      );
    return null;
  };

  return (
    <div className="mt-2">
      <h2 className="mb-5 text-xl font-bold">Have a Voucher?</h2>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="flex-1">
          <div className="text-primary mb-2 font-medium">Product Voucher</div>
          <input
            type="text"
            value={productVoucherCode}
            onChange={(e) => setProductVoucherCode(e.target.value)}
            className="w-1/2 border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
            placeholder="Enter voucher..."
          />
          <VoucherStatus
            isFetching={isProductVoucherFetching}
            isSuccess={isProductVoucherSuccess}
            isError={isProductVoucherError}
            hasData={!!voucherProductData}
            code={debouncedProductCode}
          />
        </div>

        <div className="flex-1">
          <div className="text-primary mb-2 font-medium">Delivery Voucher</div>
          <input
            type="text"
            value={deliveryVoucherCode}
            onChange={(e) => setDeliveryVoucherCode(e.target.value)}
            className="w-1/2 border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
            placeholder="Enter voucher..."
          />
          <VoucherStatus
            isFetching={isDeliveryVoucherFetching}
            isSuccess={isDeliveryVoucherSuccess}
            isError={isDeliveryVoucherError}
            hasData={!!voucherDeliveryData}
            code={debouncedDeliveryCode}
          />
        </div>
      </div>
    </div>
  );
}

export default VoucherCheckout;
