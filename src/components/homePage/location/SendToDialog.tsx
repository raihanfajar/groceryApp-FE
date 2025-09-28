import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetUserAddressInfo } from "@/hooks/home/useGetUserAddress";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import Image from "next/image";
import AddNewAddressDialog from "./AddNewAddressDialog";
import { AddressCard } from "./AddressCard";
// import { useActualLocationStore } from "@/store/useLocationStore";
// import { useSetUserDefaultAddress } from "@/hooks/home/useSetUserDefaultAddress";

const SendToDialog = ({
  displayName,
  label,
}: {
  displayName: string | null;
  label: string | null;
}) => {
  const purified = displayName?.split(",").slice(0, 2).join(", ") + "...";
  const { accessToken } = useUserAuthStore();
  const { data: userAddressInfo } = useGetUserAddressInfo(accessToken);
  // const { setLocation: setActualLocation } = useActualLocationStore();
  // const {mutateAsync: setAddressAsDefault} = useSetUserDefaultAddress(accessToken); //prettier-ignore

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <span className="cursor-pointer font-bold text-black">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-bold text-black">
                  {label ? label : displayName ? purified : "NO LOCATION"}
                </span>
              </TooltipTrigger>
              {displayName && (
                <TooltipContent>
                  <p>{displayName}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </span>
        </DialogTrigger>
        <DialogContent className="flex h-[600px] flex-col sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader className="h-fit">
            <DialogTitle>Where to?</DialogTitle>
            <DialogDescription>
              Choose and edit your location that suited you.
            </DialogDescription>
          </DialogHeader>
          {userAddressInfo?.length ? (
            <div className="!scrollbar-thin h-full space-y-3 overflow-y-auto p-2">
              {userAddressInfo
                ?.slice() // make a shallow copy so we don’t mutate react-query cache
                .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
                .map((addr, index) => (
                  <AddressCard
                    key={index}
                    id={addr.id}
                    lat={Number(addr.lat)}
                    lon={Number(addr.lon)}
                    addressLabel={addr.addressLabel}
                    receiverName={addr.receiverName}
                    receiverPhoneNumber={addr.receiverPhoneNumber}
                    addressDisplayName={addr.addressDisplayName}
                    addressDetails={addr.addressDetails}
                    isDefault={addr.isDefault}
                    // onClick={() => {
                    //   setActualLocation(Number(addr.lat), Number(addr.lon));
                    //   setAddressAsDefault(addr.id);
                    // }}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <Image
                src="/no-location-found.jpg"
                alt="no location found illustration"
                width={300}
                height={300}
              />
              <p className="text-gray-500">No Address Found</p>
            </div>
          )}
          <DialogFooter className="mt-auto">
            <AddNewAddressDialog />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendToDialog;
