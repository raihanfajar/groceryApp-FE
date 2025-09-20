import {
  AdminLoginFormValues,
  AdminAuthResponse,
  AdminApiError,
} from "@/types/admin/adminAuth";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useAdminLogin = () => {
  const router = useRouter();
  const setAdminAuth = useAdminAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (body: AdminLoginFormValues) => {
      const { data } = await axiosInstance.post<AdminAuthResponse>(
        "/admin/login",
        body,
      );
      return data;
    },
    onSuccess: (data: AdminAuthResponse) => {
      console.log("Admin login successful:", data);
      toast.success(data.message);

      // Set the admin auth to global state
      setAdminAuth({
        id: data.data.admin.id,
        name: data.data.admin.name,
        email: data.data.admin.email,
        isSuper: data.data.admin.isSuper,
        store: data.data.admin.store,
        accessToken: data.data.token,
      });

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    },
    onError: (error: AdminApiError) => {
      console.log("Admin login error:", error);
      toast.error(`${error.response.status} | ${error.response.data.message}`);
    },
  });
};
