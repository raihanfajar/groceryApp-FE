import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteUserAddress } from "@/hooks/home/useDeleteUserAddress";
import { useSetUserDefaultAddress } from "@/hooks/home/useSetUserDefaultAddress";
import { useActualLocationStore } from "@/store/useLocationStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { MdArrowDropDown } from "react-icons/md";

const AddressCardDropdown = ({
  id,
  lat,
  lon,
}: {
  id: string;
  lat: number;
  lon: number;
}) => {
  const { accessToken } = useUserAuthStore();
  const { setLocation: setActualLocation } = useActualLocationStore();
  const { mutateAsync: deleteAddress } = useDeleteUserAddress(accessToken, id);
  const {mutateAsync: setAddressAsDefault} = useSetUserDefaultAddress(accessToken, id); //prettier-ignore

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <h1 className="cursor-pointer">
          <MdArrowDropDown size={24} />
        </h1>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99] w-fit border-black shadow-md shadow-gray-400">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              console.log(id);
            }}
          >
            Select
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActualLocation(lat, lon);
              setAddressAsDefault();
            }}
          >
            Set As Default
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteAddress()}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddressCardDropdown;
