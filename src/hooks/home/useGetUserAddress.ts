import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { baseGetUserAddressResponse } from "../geocoding/typesAndInterfaces";


const fetchUserAddress = async (accessToken: string) => {
    // call your backend route
    const { data } = await axiosInstance.get<baseGetUserAddressResponse>(`/geocoding/user-address`, { headers: { Authorization: `Bearer ${accessToken}` } });
    return data.data;
}

export const useGetUserAddressInfo = (accessToken: string) => {
    return useQuery({
        queryKey: ["userAddressInfo", accessToken],
        queryFn: () => fetchUserAddress(accessToken),
        enabled: !!accessToken, // don’t run until both exist
        staleTime: 5 * 60 * 1000, // optional caching
        retry: 1, // only retry once if fails
        placeholderData: (previous) => previous, // keep showing last data while refetching
    });
}