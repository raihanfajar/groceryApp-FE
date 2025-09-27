import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useActualLocationStore,
  useDynamicLocationStore,
} from "@/store/useLocationStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { MdLocationOn } from "react-icons/md";
import SendToDialog from "../location/SendToDialog";

export default function BotNavMobile() {
  const { accessToken } = useUserAuthStore();
  const { email } = useUserAuthStore();
  const { dynamicDisplayName } = useDynamicLocationStore();
  const { actualDisplayName, label } = useActualLocationStore();
  const displayName = actualDisplayName || dynamicDisplayName;

  const purified = displayName?.split(",").slice(0, 2).join(", ") + "...";
  return (
    <div className="flex h-8 items-center border-b-1 border-black bg-[#d8d8d8] px-4 text-[0.7rem]">
      <p className="flex items-center gap-0.5">
        <MdLocationOn />
        {/* LOCATION DISPLAY */}
        {accessToken ? (
          <SendToDialog displayName={displayName} label={label} />
        ) : (
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
        )}
        {/* EMAIL DISPLAY */}
        {email ? (
          <span className="ml-1.5">[{email}]</span>
        ) : (
          <span className="ml-1.5 cursor-pointer">
            {!displayName && "Please allow location access"}
          </span>
        )}
      </p>
    </div>
  );
}
