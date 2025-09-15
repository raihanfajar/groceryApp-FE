import { Metadata } from "next";
import AdminLoginForm from "@/components/adminAuth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Administrative access to FreshNear management system",
};

export default function AdminLoginPage() {
  return (
    <div
      className="flex min-h-[calc(100vh-100px)] items-center justify-center"
      style={{
        backgroundImage: "url('/groceryBackgroundImage.jpeg')",
        backgroundSize: "25%",
      }}
    >
      <div className="w-full max-w-md rounded-lg border-2 border-black bg-[#ffffffdb] p-8 shadow-lg">
        <AdminLoginForm />
      </div>
    </div>
  );
}
