"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useAdminLogin } from "@/hooks/adminAuth/useAdminLogin";
import { AdminLoginFormValues } from "@/types/admin/adminAuth";
import { adminLoginValidationSchema } from "@/validation/adminValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";

const adminLoginSchema = adminLoginValidationSchema;

export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const adminLogin = useAdminLogin();

  const formik = useFormik<AdminLoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: adminLoginSchema,
    onSubmit: async (values) => {
      try {
        await adminLogin.mutateAsync(values);
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  const fillTestCredentials = (type: "super" | "store") => {
    if (type === "super") {
      formik.setValues({
        email: "superadmin@groceryapp.com",
        password: "superadmin123",
      });
      toast.info("Super Admin credentials filled");
    } else {
      formik.setValues({
        email: "jakarta@groceryapp.com",
        password: "storeadmin123",
      });
      toast.info("Store Admin credentials filled");
    }
  };

  return (
    <>
      {/* Title */}
      <div className="mb-4 flex items-center justify-center">
        <div className="rounded-full bg-green-700 p-3">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>
      <h2 className="text-center text-lg font-bold text-gray-800">
        Admin Login
      </h2>
      <p className="mt-1 text-center text-sm text-gray-600">
        Administrative access to FreshNear management system
      </p>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label
            htmlFor="email"
            className="text-sm font-extrabold text-green-700"
          >
            Email Address
            {formik.touched.email && formik.errors.email && (
              <span className="ml-auto text-xs text-red-600">
                {formik.errors.email}
              </span>
            )}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@groceryapp.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-extrabold text-green-700"
          >
            Password
            {formik.touched.password && formik.errors.password && (
              <span className="ml-auto text-xs text-red-600">
                {formik.errors.password}
              </span>
            )}
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-black bg-white pr-10 font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          disabled={adminLogin.isPending || !formik.isValid}
          type="submit"
          className="w-full rounded-md bg-green-700 font-semibold text-white hover:bg-black"
        >
          {adminLogin.isPending ? (
            <FaSpinner className="animate-spin" />
          ) : (
            "Admin Login"
          )}
        </Button>
      </form>

      {/* Test Credentials Section */}
      <div className="mt-6 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
        <h4 className="mb-3 text-sm font-extrabold text-green-700">
          Development Test Credentials:
        </h4>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillTestCredentials("super")}
            className="w-full border-black text-xs font-semibold hover:bg-green-700 hover:text-white"
          >
            🛡️ Fill Super Admin (All Stores Access)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillTestCredentials("store")}
            className="w-full border-black text-xs font-semibold hover:bg-green-700 hover:text-white"
          >
            🏪 Fill Store Admin (Jakarta Store Only)
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Click to auto-fill test credentials for development
        </p>
      </div>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm font-bold text-green-700 hover:underline"
        >
          ← Back to Customer Portal
        </Link>
      </div>
    </>
  );
}
