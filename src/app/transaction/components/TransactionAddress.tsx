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
    <div className="mb-5 w-full rounded-lg border border-black bg-[#ffffffdb] p-4 shadow-md">
      <div className="mb-4 flex items-center gap-2 text-base font-semibold text-[#249731] md:text-base">
        <IoLocationSharp className="text-xl" />
        Shipping Address
      </div>
      <div className="flex-row items-center justify-between space-y-4 lg:flex lg:space-y-0">
        <div className="text-primary text-xs font-semibold md:text-base">
          <div>
            {receiverName} ({addressLabel})
          </div>
          <div>{receiverPhoneNumber}</div>
        </div>
        <div className="text-primary text-xs font-medium md:text-base">
          {`${addressDetails}, ${district}, ${city}, ${province}`}
        </div>
      </div>
    </div>
  );
}

export default TransactionAddress;
