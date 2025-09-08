import UserRegisterForm from "@/components/userAuth/RegisterForm";
import Link from "next/link";

const UserRegisterPage = () => {
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
        <h2 className="text-center text-lg font-bold text-gray-800">
          Register
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Already have a FreshNear account?{" "}
          <Link
            href={"/user-login"}
            className="font-bold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
        <UserRegisterForm />
      </div>
    </div>
  );
};

export default UserRegisterPage;
