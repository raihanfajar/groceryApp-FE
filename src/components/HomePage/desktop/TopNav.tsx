import Link from "next/link";
import {
  MdLocationOn,
  MdOutlineDiversity3,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { CustomerServiceDropDown, DiscoverDropDown } from "./DropDown";

const TopNav = () => {
  return (
    <div className="flex h-8 items-center border-b-1 border-black bg-[#d8d8d8] px-24">
      <p className="flex items-center gap-0.5">
        <MdLocationOn />
        <span className="font-bold text-black">NO LOCATION</span>
        <Link href={"#"} className="ml-1.5 cursor-pointer">
          Login to change location
        </Link>
      </p>
      <div className="ml-auto flex gap-6 underline">
        <div className="flex items-center gap-1">
          <MdOutlineSupportAgent size={20} />
          <CustomerServiceDropDown />
        </div>
        <div className="flex items-center gap-1">
          <MdOutlineDiversity3 size={20} />
          <DiscoverDropDown />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
