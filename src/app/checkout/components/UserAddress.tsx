"use client";

import AddNewAddressDialog from "@/components/homePage/location/AddNewAddressDialog";
import { UserAddressInterface } from "@/types/checkout/checkoutTypes";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";

type UserAddressProps = {
  addresses: UserAddressInterface[];
  selectedAddress: UserAddressInterface | null;
  onAddressChange: (address: UserAddressInterface) => void;
};

const UserAddress = ({
  addresses,
  selectedAddress,
  onAddressChange,
}: UserAddressProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedAddress) {
      setTempSelectedId(selectedAddress.id);
    }
  }, [selectedAddress]);

  const openModal = () => {
    if (selectedAddress) {
      setTempSelectedId(selectedAddress.id);
    }
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  // const addNewAddress = () => {
  //   <AddNewAddressDialog />
  // };

  const handleConfirmSelection = () => {
    const newSelectedAddress = addresses.find(
      (addr) => addr.id === tempSelectedId,
    );
    if (newSelectedAddress) {
      onAddressChange(newSelectedAddress);
    }
    closeModal();
  };

  const router = useRouter();

  if (!addresses || addresses.length === 0) {
    return (
      <div className="mb-5 flex h-auto min-h-[150px] w-full items-center justify-center rounded-lg border border-black bg-white p-6 text-center shadow-md">
        <div>
          <p className="mb-4 text-gray-600">You have no saved addresses.</p>
          <AddNewAddressDialog />
        </div>
      </div>
    );
  }

  if (!selectedAddress) {
    return null;
  }

  return (
    <>
      <div className="mb-5 h-auto w-full rounded-lg border border-black bg-[#ffffffdb] p-4 shadow-md">
        <div className="mb-4 flex items-center gap-4 text-lg font-semibold text-[#249731] md:text-xl">
          <IoLocationSharp className="text-2xl" />
          Shipping Address
        </div>
        <div className="flex-row items-center justify-between space-y-4 lg:flex lg:space-y-0">
          <div className="text-primary text-xs font-semibold md:text-base">
            <div>
              {selectedAddress.receiverName} ({selectedAddress.addressLabel})
            </div>
            <div>{selectedAddress.receiverPhoneNumber}</div>
          </div>
          <div className="text-primary text-sm font-medium md:text-base">
            {`${selectedAddress.addressDetails}, ${selectedAddress.district}, ${selectedAddress.city}, ${selectedAddress.province}`}
          </div>
          <button
            type="button"
            className="text-primary flex h-auto w-auto cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-white p-3 text-sm font-medium"
            onClick={openModal}
          >
            Change Address
          </button>
        </div>
      </div>

      <dialog ref={modalRef} className="modal">
        <div className="w-[80%] rounded-xl border-2 bg-white p-4 lg:w-[50%]">
          <h3 className="border-b pb-3 text-lg font-bold">Choose Address</h3>
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-2">
            {addresses.map((address) => (
              <label
                key={address.id}
                className="flex cursor-pointer items-start gap-4 rounded-lg border p-4 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="address"
                  className="radio radio-primary mt-1"
                  checked={tempSelectedId === address.id}
                  onChange={() => setTempSelectedId(address.id)}
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-1 md:gap-3">
                    <div className="text-primary md:text-l line-clamp-2 text-xs font-bold break-words">
                      {address.addressLabel}
                    </div>
                    <div className="">|</div>
                    <div className="text-primary md:text-l line-clamp-2 text-xs break-words">
                      {address.receiverPhoneNumber}
                    </div>
                  </div>
                  <div className="text-primary md:text-l mt-1 line-clamp-2 text-xs font-bold break-words">
                    {address.receiverName}
                  </div>
                  <div className="text-primary md:text-l mt-2 text-xs">
                    {address.addressDetails}
                  </div>
                  <div className="text-primary md:text-l text-xs">
                    {`${address.district}, ${address.city}, ${address.province}`}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="modal-action mt-6 border-t pt-4">
            <button className="btn btn-ghost" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="btn btn-primary border-black bg-[#dbfce7] text-black"
              onClick={handleConfirmSelection}
            >
              Choose This Address
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default UserAddress;
