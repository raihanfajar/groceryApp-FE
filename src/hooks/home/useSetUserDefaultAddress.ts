import { baseError } from "@/components/userAuth/typesAndInterfaces"
import { axiosInstance } from "@/utils/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useSetUserDefaultAddress = (accessToken: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (addressId: string) => {
            const { data } = await axiosInstance.post<{ status: string, message: string }>("/geocoding/set-user-default-address", { addressId }, { headers: { Authorization: `Bearer ${accessToken}` } });
            return data;
        },
        onSuccess: (data: { status: string, message: string }) => {
            console.log(data); // !Delete on production
            toast.info("Address targeted");

            queryClient.invalidateQueries({ queryKey: ["userAddressInfo"] });
            queryClient.invalidateQueries({ queryKey: ["nearestStore"] });
            queryClient.invalidateQueries({ queryKey: ["targetStoreProductsInfo"] });
        },
        onError: (error: baseError) => {
            console.log(error); // !Delete on production
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}