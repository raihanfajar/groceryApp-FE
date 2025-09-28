import { useActualLocationStore } from "@/store/useLocationStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  const { logout: adminLogout } = useAdminAuthStore();
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
            <DialogClose asChild>
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["userAddressInfo"],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["userProfileInfo"],
                  });
                  // Clear both user and admin auth
                  clearAuth();
                  adminLogout();
                  clearLocation();
                  router.replace("/");
                }}
                className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
              >
                Continue
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
