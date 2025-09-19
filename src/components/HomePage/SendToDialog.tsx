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
import { useLocationStore } from "@/store/useLocationStore";
import AddNewAddressDialog from "./AddNewAddressDialog";

const SendToDialog = () => {
  const { displayName } = useLocationStore();
  const purified = displayName?.split(",").slice(0, 2).join(", ") + "...";

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
          <div className="h-full">Testing</div>
          <DialogFooter className="mt-auto">
            <AddNewAddressDialog />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendToDialog;
