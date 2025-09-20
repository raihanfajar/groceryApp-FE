import Link from "next/link";
import {
  MdLocationOn,
  MdOutlineDiversity3,
  MdOutlineSupportAgent,
} from "react-icons/md";
import {
  useHydratedUserAuth,
  useHydratedAdminAuth,
} from "@/hooks/useHydratedAuth";
import { useLocationStore } from "@/store/useLocationStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomerServiceDropDown, DiscoverDropDown } from "./DropDown";

export default function TopNavDesktop() {
  const { email } = useHydratedUserAuth();
  const { isAuthenticated: isAdminAuthenticated, isHydrated } =
    useHydratedAdminAuth();
  const { displayName } = useLocationStore();
  const purified = displayName?.split(",").slice(0, 2).join(", ") + "...";

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
        {isHydrated && isAdminAuthenticated() && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            🛡️ Admin Dashboard
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
