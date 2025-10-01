import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteStoreAdmin = (accessToken: string | null | undefined) => useMutation({
    mutationFn: async (adminId: string) => {
        const response = await axiosInstance.delete(
            `/admin/store-admins/${adminId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );
        return response.data;
    },
    onSuccess: () => {
        toast.success("Store admin deleted successfully");
    },
    onError: (error: unknown) => {
        const errorMessage =
            error instanceof Error ? error.message : "Failed to delete store admin";
        toast.error(errorMessage);
    },
});