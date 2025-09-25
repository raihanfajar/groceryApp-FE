import { useUserAuthStore } from "@/store/useUserAuthStore";
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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useActualLocationStore } from "@/store/useLocationStore";
import { useQueryClient } from "@tanstack/react-query";

const LogoutDialog = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useUserAuthStore();
  const { clearLocation } = useActualLocationStore();
  const router = useRouter();
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <p className="cursor-pointer">Logout</p>
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
