import { storeRequest } from "@/components/admin/users/typesAndInterfaces";
import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UpdateStoreRequest {
    storeId: string;
    body: storeRequest
}

export const useUpdateStore = (accessToken: string | null | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ storeId, body }: UpdateStoreRequest) => {
            const { data } = await axiosInstance.patch<{ status: string; message: string; }>(`/stores/update/${storeId}`, body, { headers: { Authorization: `Bearer ${accessToken}` } });
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