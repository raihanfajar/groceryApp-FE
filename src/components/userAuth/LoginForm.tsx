"use client";
import { useResendVerification } from "@/hooks/userAuth/useResendVerification";
import { useUnifiedLogin } from "@/hooks/auth/useUnifiedLogin";
import { userLoginSchema } from "@/validation/userVS";
import { useFormik } from "formik";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { baseError, LoginFormValues } from "./typesAndInterfaces";

const UserLoginForm = () => {
  const { mutateAsync, isPending, error } = useUnifiedLogin();
  const { mutateAsync: resendVerification } = useResendVerification();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: userLoginSchema,
    onSubmit: async (values) => {
      await mutateAsync({
        email: values.email,
        password: values.password,
      }).then(() => formik.resetForm());
    },
  });

  const backendError = error as baseError;
  const errorMessage = backendError?.response?.data?.message;

  return (
    <>
      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          formik={formik}
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          formik={formik}
          withPopover
        />

        {/* Forgot Password */}
        <div className="flex items-center justify-end">
          <ForgotPasswordDialog />
        </div>

        {errorMessage === "Please verify your email first" && (
          <div className="mt-2 text-xs text-red-600">
            <p>Your email is not verified yet.</p>
            <p>Please check your registered email.</p>
            <span
              className="cursor-pointer text-blue-600 underline"
              onClick={() => resendVerification(formik.values.email)}
            >
              Resend verification email
            </span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          disabled={isPending || !formik.isValid}
          type="submit"
          className="w-full rounded-md bg-green-700 font-semibold text-white hover:bg-black"
        >
          {isPending ? <FaSpinner className="animate-spin" /> : "Login"}
        </Button>
      </form>

      {/* Development Helper for Admin Credentials */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="mb-2 text-xs font-semibold text-gray-700">
            🛠️ Development Admin Credentials:
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>
              <strong>Super Admin:</strong> superadmin@groceryapp.com /
              superadmin123
            </p>
            <p>
              <strong>Store Admin:</strong> jakarta@groceryapp.com /
              storeadmin123
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserLoginForm;
