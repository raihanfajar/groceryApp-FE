"use client";
import { userRegisterSchema } from "@/validation/userVS";
import { useFormik } from "formik";
import { FaFacebookF, FaGithub, FaGoogle, FaSpinner, FaTwitter } from "react-icons/fa";
import { Button } from "../ui/button";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { LoginFormValues } from "./typesAndInterfaces";
import { useUserLogin } from "@/hooks/userAuth/useUserLogin";

const UserLoginForm = () => {
  const { mutateAsync, isPending } = useUserLogin();
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: userRegisterSchema,
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

        {/* Submit Button */}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full rounded-md bg-green-700 font-semibold text-white hover:bg-black"
        >
          {isPending ? <FaSpinner className="animate-spin" /> : "Login"}
        </Button>

        {/* Social Logins */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" className="hover:bg-gray-100">
            <FaGoogle />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-gray-100">
            <FaFacebookF />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-gray-100">
            <FaTwitter />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-gray-100">
            <FaGithub />
          </Button>
        </div>
      </form>
    </>
  );
};

export default UserLoginForm;
