import UserLoginForm from "@/components/userAuth/LoginForm";
import SocialLogin from "@/components/userAuth/SocialLogin";
import Link from "next/link";

const UserLoginPage = () => {
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
          Don&apos;t have a FreshNear account yet?{" "}
          <Link
            href={"/user-register"}
            className="font-bold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
        <UserLoginForm />
        <SocialLogin />
      </div>
    </div>
  );
};

export default UserLoginPage;
