import Link from "next/link";
import {
  MdLocationOn,
  MdOutlineDiversity3,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { CustomerServiceDropDown, DiscoverDropDown } from "./DropDown";

export default function TopNavDesktop() {
  const { email } = useUserAuthStore();
  const {
    admin,
    logout: adminLogout,
    isAuthenticated: isAdminAuthenticated,
  } = useAdminAuthStore();

  const handleAdminLogout = () => {
    adminLogout();
    // Optionally redirect to home page or show a success message
    window.location.href = "/";
  };

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
        {isAdminAuthenticated() ? (
          <button
            onClick={handleAdminLogout}
            className="flex cursor-pointer items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            🛡️ Admin Logout {admin?.name && `(${admin.name})`}
          </button>
        ) : (
          <Link
            href="/admin-login"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            🛡️ Admin Login
          </Link>
        )}
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
