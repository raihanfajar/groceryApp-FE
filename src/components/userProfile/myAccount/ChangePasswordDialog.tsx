"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangeUserPassword } from "@/hooks/userProfile/useChangeUserPassword";
import { useGetUserProfileInfo } from "@/hooks/userProfile/useGetUserProfileInfo";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const ChangePasswordDialog = () => {
  const { accessToken } = useUserAuthStore();
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useChangeUserPassword(accessToken);
  const {data: userData} = useGetUserProfileInfo(accessToken);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);

  const resetFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setShowCurrent(false);
    setShowNew(false);
  };

  const handleSubmit = () => {
    if (currentPassword === newPassword)
      return toast.error("Password must be different");
    if (!currentPassword || !newPassword) return;
    mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          resetFields();
          // bump key → dialog remounts → closed by default
          setDialogKey((k) => k + 1);
        },
      },
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const isDisabled =
    isPending || !currentPassword.trim() || !newPassword.trim();

  return (
    <Dialog key={dialogKey}>
      <DialogTrigger asChild>
        <Button hidden={!!userData?.provider} className="cursor-pointer rounded-full bg-green-600 px-4 text-white hover:bg-green-700">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-lg font-bold text-gray-800">
            Change Password
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mb-3 grid gap-4"
        >
          <div className="grid gap-3">
            <Label
              htmlFor="currentPassword"
              className="font-extrabold text-green-700"
            >
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                ref={currentPasswordRef}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={onKeyDown}
                className="border-black bg-white pr-10 font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
              />
              <button
                tabIndex={-1}
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            <Label
              htmlFor="newPassword"
              className="font-extrabold text-green-700"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                ref={newPasswordRef}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={onKeyDown}
                className="border-black bg-white pr-10 font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
              />
              <button
                tabIndex={-1}
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                resetFields();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-green-700"
            disabled={isDisabled}
            onClick={handleSubmit}
            type="submit"
          >
            {isPending ? "Changing password..." : "Change password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
