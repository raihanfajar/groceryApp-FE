import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserForgotPassword } from "@/hooks/userAuth/useForgotPassword";
import { useRef } from "react";

const ForgotPasswordDialog = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUserForgotPassword();

  const handleSubmit = () => {
    const email = emailRef.current?.value;
    if (!email) return;
    mutate(email);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer text-sm leading-6 font-semibold text-green-700 hover:text-black">
          Forgot Password?
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-lg font-bold text-gray-800">
            Forgot Password
          </DialogTitle>
          <DialogDescription>
            Just fill in your email below and we will send a link to update your
            password.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-3 grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="email" className="font-extrabold text-green-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              ref={emailRef}
              className="border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="bg-green-700"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Sending..." : "Send Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
