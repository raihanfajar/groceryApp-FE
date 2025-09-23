import React from "react";
import { IoLocationSharp } from "react-icons/io5";

type TransactionAddressProps = {
  receiverName: string;
  receiverPhoneNumber: string;
  addressDetails: string;
  district: string;
  city: string;
  province: string;
  addressLabel: string;
};

function TransactionAddress({
  receiverName,
  receiverPhoneNumber,
  addressDetails,
  district,
  city,
  province,
  addressLabel,
}: TransactionAddressProps) {
  return (
    <div className="mb-5 h-auto w-full rounded-lg bg-[#f5f5f5] p-6">
      <div className="mb-4 flex items-center gap-4 text-lg font-semibold text-[#249731] md:text-xl">
        <IoLocationSharp className="text-2xl" />
        Shipping Address
      </div>
      <div className="flex-row items-center justify-between space-y-4 lg:flex lg:space-y-0">
        <div className="text-primary text-l font-bold md:text-lg">
          <div>{receiverName} ({addressLabel})</div>
          <div>{receiverPhoneNumber}</div>
        </div>
        <div className="text-primary text-sm font-medium md:text-base">
          {`${addressDetails}, ${district}, ${city}, ${province}`}
        </div>
      </div>
    </div>
  );
}

export default TransactionAddress;
