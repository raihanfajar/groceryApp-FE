import Link from "next/link";
import {
  MdLocationOn,
  MdOutlineDiversity3,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { CustomerServiceDropDown, DiscoverDropDown } from "./DropDown";
import { useLocationStore } from "@/store/useLocationStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TopNavDesktop() {
  const { email } = useUserAuthStore();
  const {
    admin,
    logout: adminLogout,
    isAuthenticated: isAdminAuthenticated,
  } = useAdminAuthStore();
  const { displayName } = useLocationStore();
  const purified = displayName?.split(",").slice(0, 2).join(", ") + "...";

  const handleAdminLogout = () => {
    adminLogout();
    // Optionally redirect to home page or show a success message
    window.location.href = "/";
  };

  return (
    <div className="flex h-8 items-center border-b-1 border-black bg-[#d8d8d8] px-24">
      <p className="flex items-center gap-0.5">
        <MdLocationOn />
        {/* LOCATION DISPLAY */}
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
        {/* EMAIL DISPLAY */}
        {email ? (
          <span className="ml-1.5">[{email}]</span>
        ) : (
          <span className="ml-1.5 cursor-pointer">
            {!displayName && "Please allow location access"}
          </span>
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
