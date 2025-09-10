"use client";
import { useUserLogin } from "@/hooks/userAuth/useUserLogin";
import { userLoginSchema } from "@/validation/userVS";
import { useFormik } from "formik";
import {
  FaSpinner
} from "react-icons/fa";
import { Button } from "../ui/button";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { LoginFormValues } from "./typesAndInterfaces";

const UserLoginForm = () => {
  const { mutateAsync, isPending } = useUserLogin();
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

        {/* Submit Button */}
        <Button
          disabled={isPending || !formik.isValid}
          type="submit"
          className="w-full rounded-md bg-green-700 font-semibold text-white hover:bg-black"
        >
          {isPending ? <FaSpinner className="animate-spin" /> : "Login"}
        </Button>

        
      </form>
    </>
  );
};

export default UserLoginForm;
