import { addStoreRequest, storeResponse } from "@/components/admin/users/typesAndInterfaces";
import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAddStore = (accessToken: string | null | undefined) => useMutation({
    mutationFn: async (body: addStoreRequest) => {
        const { data } = await axiosInstance.post<storeResponse>("/stores/add", body, { headers: { Authorization: `Bearer ${accessToken}` } });
        return data;
    },
    onSuccess: (data) => {
        toast.success(data.message);
    },
    onError: (error: baseError) => {
        toast.error(`${error.response.status} | ${error.response.data.message}`);
    },
})