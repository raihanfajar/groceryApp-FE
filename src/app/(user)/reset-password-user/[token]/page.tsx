"use client";
import ResetPasswordForm from "@/components/userAuth/ResetPasswordForm";
import { useParams } from "next/navigation";

const ResetPasswordUser = () => {
  const { token } = useParams() as { token: string };
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{
        backgroundImage: "url('/groceryBackgroundImage.jpeg')",
        backgroundSize: "25%",
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-gray-300 bg-white/90 p-10 shadow-2xl">
        {/* Title */}
        <h2 className="text-center text-lg font-bold text-gray-800">
          Create new password
        </h2>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

export default ResetPasswordUser;
