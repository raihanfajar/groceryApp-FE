"use client";
import UserLoginForm from "@/components/userAuth/LoginForm";
import SocialLogin from "@/components/userAuth/SocialLogin";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const UserLoginPage = () => {
  const { accessToken } = useUserAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  if (accessToken) return router.push(returnUrl);

  return (
    <div
      className="flex min-h-[calc(100vh-100px)] items-center justify-center"
      style={{
        backgroundImage: "url('/groceryBackgroundImage.jpeg')",
        backgroundSize: "25%",
      }}
    >
      <div className="w-full max-w-md rounded-lg border-2 border-black bg-[#ffffffdb] p-8 shadow-lg">
        {/* Title */}
        <h2 className="text-center text-lg font-bold text-gray-800">Login</h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Sign in to your FreshNear account or admin dashboard
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          Don&apos;t have a customer account yet?{" "}
          <Link
            href={"/user-register"}
            className="font-bold text-blue-600 hover:underline"
          >
            Register here
          </Link>
        </p>
        <UserLoginForm />
        <SocialLogin />
      </div>
    </div>
  );
};

export default UserLoginPage;
