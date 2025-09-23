import {
  useHydratedAdminAuth,
  useHydratedUserAuth,
} from "@/hooks/useHydratedAuth";
import {
  useActualLocationStore,
  useDynamicLocationStore,
} from "@/store/useLocationStore";
import Link from "next/link";
import {
  MdLocationOn,
  MdOutlineDiversity3,
  MdOutlineSupportAgent,
} from "react-icons/md";
import SendToDialog from "../location/SendToDialog";
import { CustomerServiceDropDown, DiscoverDropDown } from "./DropDown";

export default function TopNavDesktop() {
  const { email } = useHydratedUserAuth();
  const { isAuthenticated: isAdminAuthenticated, isHydrated } =
    useHydratedAdminAuth();
  const { actualDisplayName } = useActualLocationStore();
  const { dynamicDisplayName } = useDynamicLocationStore();

  const displayName = actualDisplayName || dynamicDisplayName;

  return (
    <div className="flex h-8 items-center border-b-1 border-black bg-[#d8d8d8] px-24">
      <p className="flex items-center gap-0.5">
        <MdLocationOn />
        {/* LOCATION DISPLAY */}
        <SendToDialog displayName={displayName} />
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
