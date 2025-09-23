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
import AddNewAddressDialog from "./AddNewAddressDialog";
import { AddressCard } from "./AddressCard";

const SendToDialog = ({ displayName }: { displayName: string | null }) => {
  const purified = displayName?.split(",").slice(0, 2).join(", ") + "...";
  const { accessToken } = useUserAuthStore();
  const { data: userAddressInfo } = useGetUserAddressInfo(accessToken);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <span className="cursor-pointer font-bold text-black">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-bold text-black">
                  {displayName ? purified : "NO LOCATION"}
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
                .map((addr) => (
                  <AddressCard
                    key={addr.id}
                    addressLabel={addr.addressLabel}
                    receiverName={addr.receiverName}
                    receiverPhoneNumber={addr.receiverPhoneNumber}
                    addressDisplayName={addr.addressDisplayName}
                    addressDetails={addr.addressDetails}
                    isDefault={addr.isDefault}
                  />
                ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
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

// [
//     {
//         "addressLabel": "testing",
//         "receiverName": "testing",
//         "receiverPhoneNumber": "081380424685",
//         "addressDisplayName": "BSD City, Serpong, Tangerang Selatan, Banten, Jawa, 15321, Indonesia",
//         "addressDetails": "testing",
//         "lat": "-6.301577",
//         "lon": "106.687506",
//         "isDefault": false,
//         "provinceId": 1,
//         "province": "BANTEN",
//         "cityId": 1,
//         "city": "TANGERANG SELATAN",
//         "district": "SERPONG",
//         "districtId": 1
//     },
//     {
//         "addressLabel": "testong",
//         "receiverName": "testong",
//         "receiverPhoneNumber": "081389273829",
//         "addressDisplayName": "BSD City, Serpong, Tangerang Selatan, Banten, Jawa, 15321, Indonesia",
//         "addressDetails": "testong",
//         "lat": "-6.301577",
//         "lon": "106.687506",
//         "isDefault": false,
//         "provinceId": 1,
//         "province": "BANTEN",
//         "cityId": 1,
//         "city": "TANGERANG SELATAN",
//         "district": "SERPONG",
//         "districtId": 1
//     },
//     {
//         "addressLabel": "ANOTHER ONE",
//         "receiverName": "ANOTHER ONE",
//         "receiverPhoneNumber": "081389273829",
//         "addressDisplayName": "BSD City, Serpong, Tangerang Selatan, Banten, Jawa, 15321, Indonesia",
//         "addressDetails": "ANOTHER ONE",
//         "lat": "-6.301577",
//         "lon": "106.687506",
//         "isDefault": true,
//         "provinceId": 1,
//         "province": "BANTEN",
//         "cityId": 1,
//         "city": "TANGERANG SELATAN",
//         "district": "SERPONG",
//         "districtId": 1
//     }
// ]
