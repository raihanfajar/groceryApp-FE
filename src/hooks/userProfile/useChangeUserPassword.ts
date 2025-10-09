import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useChangeUserPassword = (accessToken: string) => {

    return useMutation({
        mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }): Promise<{ status: string; message: string; }> => {
            const { data } = await axiosInstance.patch<{ status: string; message: string }>(
                "/user/change-password",
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return data;
        },
        onSuccess: (data: { status: string; message: string }) => {
            toast.success(data.message);
        },
        onError: (error: baseError) => {
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    });
};
