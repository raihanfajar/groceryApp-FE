import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteStore = (accessToken: string | null | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (storeId: string) => {
            const { data } = await axiosInstance.delete<{ status: string; message: string }>(`/stores/delete/${storeId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log("Store Id dari hook delete", storeId);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["get-all-store"] });
            toast.success(data.message);
        },
        onError: (error: baseError) => {
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}