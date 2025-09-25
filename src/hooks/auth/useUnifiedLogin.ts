import { baseError, baseUserResponse, LoginFormValues } from "@/components/userAuth/typesAndInterfaces";
import { AdminAuthResponse, AdminApiError } from "@/types/admin/adminAuth";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useUnifiedLogin = () => {
    const router = useRouter();
    const setUserAuth = useUserAuthStore((state) => state.setAuth);
    const setAdminAuth = useAdminAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (body: LoginFormValues) => {
            // First, try user login
            try {
                const { data } = await axiosInstance.post<baseUserResponse>("/user/login", body);
                return { type: 'user', data };
            } catch (userError) {
                // If user login fails, try admin login
                try {
                    const { data } = await axiosInstance.post<AdminAuthResponse>("/admin/login", body);
                    return { type: 'admin', data };
                } catch {
                    // If both fail, throw the original user error (more common case)
                    throw userError;
                }
            }
        },
        onSuccess: (result) => {
            if (result.type === 'user') {
                const data = result.data as baseUserResponse;
                console.log("User login successful:", data);
                toast.success(data.message);
                
                // Set the user token to global state
                setUserAuth({
                    id: data.data.id,
                    name: data.data.name,
                    email: data.data.email,
                    accessToken: data.data.accessToken,
                });
                
                // Redirect to home page
                router.push("/");
            } else if (result.type === 'admin') {
                const data = result.data as AdminAuthResponse;
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
            }
        },
        onError: (error: baseError | AdminApiError) => {
            console.log("Login error:", error);
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    });
};