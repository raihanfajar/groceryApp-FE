import { baseError } from "@/components/userAuth/typesAndInterfaces"
import { axiosInstance } from "@/utils/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useDeleteUserAddress = (accessToken: string, addressId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.delete<{ status: string; message: string }>(`/geocoding/delete-user-address?addressId=${addressId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            return data;
        },
        onSuccess: (data: { status: string, message: string }) => {
            console.log(data); // !Delete on production
            toast.success(data.message);

            queryClient.invalidateQueries({ queryKey: ["userAddressInfo"] });
        },
        onError: (error: baseError) => {
            console.log(error); // !Delete on production
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}