"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle, FaTwitter } from "react-icons/fa";

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-gray-800">
          Login
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Don&apos;t have a FreshNear account yet?{" "}
          <Link
            href={"/user-register"}
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email or Phone Number
            </Label>
            <Input
              id="email"
              placeholder="Enter your email or phone"
              className="mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/user-forgot-password"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Forgot Password? (Dev)
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-md bg-green-700 font-semibold text-white hover:bg-black"
          >
            Login
          </Button>

          {/* Social Logins (optional) */}
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
      </div>
    </div>
  );
};

export default UserLogin;
