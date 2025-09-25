// components/AddressCard.tsx
import { cn } from "@/lib/utils";
import AddressCardDropdown from "./AddressCardDropdown";
import { MapPin } from "lucide-react"; // nice icon for location

interface AddressCardProps {
  id: string;
  lat: number;
  lon: number;
  addressLabel: string;
  receiverName: string;
  receiverPhoneNumber: string;
  addressDisplayName: string;
  addressDetails: string;
  isDefault: boolean;
  onClick?: () => void;
}

export const AddressCard = ({
  id,
  lat,
  lon,
  addressLabel,
  receiverName,
  receiverPhoneNumber,
  addressDisplayName,
  addressDetails,
  isDefault,
  onClick,
}: AddressCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        // base card style
        "group relative cursor-pointer rounded-xl border bg-white/50 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md",
        // default address accent needed kah?
        "border-gray-200",
      )}
    >
      {/* header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={18} className={cn("mt-[2px]", "text-gray-400")} />
          <h3 className="text-base font-semibold text-gray-800">
            {addressLabel}
          </h3>
          {isDefault && (
            <span className="ml-1 rounded-full bg-blue-500/90 px-2 py-0.5 text-xs font-medium text-white">
              Default
            </span>
          )}
        </div>
        <AddressCardDropdown id={id} lat={lat} lon={lon} />
      </div>

      {/* receiver info */}
      <p className="text-sm font-medium text-gray-700">
        {receiverName} —{" "}
        <span className="font-normal text-gray-600">{receiverPhoneNumber}</span>
      </p>

      {/* address display */}
      <p className="mt-3 text-sm text-gray-700">{addressDisplayName}</p>

      {/* address details */}
      {addressDetails && (
        <p className="mt-1 text-xs text-gray-500 italic">“{addressDetails}”</p>
      )}
    </div>
  );
};
