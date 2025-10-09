import { baseError, baseUserResponse, LoginFormValues } from "@/components/userAuth/typesAndInterfaces";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


export const useUserLogin = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    const setUserAuth = useUserAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (body: LoginFormValues) => {
            const { data } = await axiosInstance.post<baseUserResponse>("/user/login", body);
            return data;
        },
        onSuccess: (data: baseUserResponse) => {
            queryClient.invalidateQueries({ queryKey: ["userAddressInfo"] });
            queryClient.invalidateQueries({ queryKey: ["nearestStore"] });
            queryClient.invalidateQueries({ queryKey: ["targetStoreProductsInfo"] });
            queryClient.invalidateQueries({ queryKey: ["userProfileInfo"] });
            toast.success(data.message);
            // Set the token to global state
            setUserAuth({
                id: data.data.id,
                name: data.data.name,
                email: data.data.email,
                accessToken: data.data.accessToken,
            });
            // router.push("/");
            options?.onSuccess?.();
        },
        onError: (error: baseError) => {
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}