import { useActualLocationStore } from "@/store/useLocationStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const LogoutDialog = ({ isDesktop }: { isDesktop: boolean }) => {
  const queryClient = useQueryClient();
  const { clearAuth } = useUserAuthStore();
  const { clearLocation } = useActualLocationStore();
  const router = useRouter();
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {isDesktop ? (
            <p className="cursor-pointer">Logout</p>
          ) : (
            <button className="w-full cursor-pointer rounded-md bg-green-700 py-2 text-white hover:bg-black">
              Logout
            </button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogDescription className="text-red-600">
              All unsaved changes will be lost
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["userAddressInfo"],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["userProfileInfo"],
                  });
                  clearAuth();
                  clearLocation();
                  router.push("/");
                }}
                className="bg-green-700"
              >
                Continue
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
