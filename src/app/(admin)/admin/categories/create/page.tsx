"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "react-toastify";
import CategoryCreateHeader from "@/components/admin/category/CategoryCreateHeader";
import CategoryCreateForm from "@/components/admin/category/CategoryCreateForm";

export default function CreateCategoryPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    if (!admin?.isSuper) {
      toast.error("Access denied. Super admin privileges required.");
      router.push("/admin/categories");
      return;
    }
  }, [isAuthenticated, router, admin?.isSuper]);

  if (!isAuthenticated() || !admin?.isSuper) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <CategoryCreateHeader />

        {/* Form */}
        <CategoryCreateForm accessToken={admin.accessToken} />
      </div>
    </AdminLayout>
  );
}
