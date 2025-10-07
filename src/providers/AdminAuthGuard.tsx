"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export default function AdminAuthGuard({
  children,
  requireSuperAdmin = false,
}: AdminAuthGuardProps) {
  const { isAuthenticated, isSuperAdmin } = useAdminAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for hydration
    const timer = setTimeout(() => {
      if (!isAuthenticated()) {
        router.push("/");
        return;
      }

      if (requireSuperAdmin && !isSuperAdmin()) {
        router.push("/admin/dashboard");
        return;
      }

      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isSuperAdmin, requireSuperAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
