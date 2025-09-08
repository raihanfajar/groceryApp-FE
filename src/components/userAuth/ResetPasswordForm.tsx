"use client";
import { useResetPassword } from "@/hooks/userAuth/useResetPassword";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import { PasswordField } from "./PasswordField";
import { ResetPasswordFormValues } from "./typesAndInterfaces";
import { userResetPasswordSchema } from "@/validation/userVS";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const { mutateAsync, isPending } = useResetPassword();

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: userResetPasswordSchema, // <-- you can add Yup validation later
    onSubmit: async (values) => {
      await mutateAsync({ token, newPassword: values.newPassword })
        .then(() => formik.resetForm())
        .then(() => router.push("/user-login"));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
      <PasswordField
        id="newPassword"
        label="New Password"
        placeholder="Enter your password"
        formik={formik}
        withPopover
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        formik={formik}
      />

      <Button
        disabled={isPending || !formik.isValid}
        type="submit"
        className="w-full rounded-md bg-green-700 font-semibold text-white hover:bg-black"
      >
        {isPending ? (
          <FaSpinner className="animate-spin" />
        ) : (
          "Initiate new password"
        )}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
