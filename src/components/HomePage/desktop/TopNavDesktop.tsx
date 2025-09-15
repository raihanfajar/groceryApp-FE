import Link from "next/link";
import {
  MdLocationOn,
  MdOutlineDiversity3,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { CustomerServiceDropDown, DiscoverDropDown } from "./DropDown";

export default function TopNavDesktop() {
  const { email } = useUserAuthStore();
  return (
    <div className="flex h-8 items-center border-b-1 border-black bg-[#d8d8d8] px-24">
      <p className="flex items-center gap-0.5">
        <MdLocationOn />
        <span className="font-bold text-black">NO LOCATION</span>
        {email ? (
          <span className="ml-1.5">[{email}]</span>
        ) : (
          <Link href="/user-login" className="ml-1.5 cursor-pointer">
            Login to change location (Dev)
          </Link>
        )}
      </p>
      <div className="ml-auto flex gap-6 underline">
        <Link
          href="/admin-login"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          🛡️ Admin Login
        </Link>
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
}
