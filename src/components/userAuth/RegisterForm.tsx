"use client";
import { userRegisterSchema } from "@/validation/userVS";
import { useFormik } from "formik";
import { Button } from "../ui/button";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { RegisterFormValues } from "./typesAndInterfaces";
import { useUserRegister } from "@/hooks/userAuth/useUserRegister";
import { FaSpinner } from "react-icons/fa";

const UserRegisterForm = () => {
  const { mutateAsync, isPending } = useUserRegister();

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: userRegisterSchema,
    onSubmit: async (values) => {
      await mutateAsync({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      }).then(() => formik.resetForm());
    },
  });

  return (
    <>
      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
        <FormField
          id="name"
          label="Fullname"
          placeholder="Enter your fullname"
          formik={formik}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          formik={formik}
        />
        <FormField
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          formik={formik}
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          formik={formik}
          withPopover
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
          formik={formik}
        />

        {/* Submit Button */}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full rounded-md bg-green-700 font-semibold text-white hover:bg-black"
        >
          {isPending ? <FaSpinner className="animate-spin" /> : "Register"}
        </Button>
      </form>
    </>
  );
};

export default UserRegisterForm;
