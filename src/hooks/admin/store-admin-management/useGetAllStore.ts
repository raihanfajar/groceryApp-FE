import { storeResponse } from "@/components/admin/users/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetAllStore = (accessToken: string | null | undefined) => {
    const fetchAllStore = async (accessToken: string | null | undefined) => {
        // call your backend route
        const { data } = await axiosInstance.get<storeResponse>(`/admin/stores`, { headers: { Authorization: `Bearer ${accessToken}` } });
        return data.data;
    }

    return useQuery({
        queryKey: ["get-all-store", accessToken],
        queryFn: () => fetchAllStore(accessToken),
        enabled: !!accessToken, // don't run until accessToken exist
        retry: 1, // only retry once if fails
        // staleTime: 5 * 60 * 1000, // optional caching
        // placeholderData: (previous) => previous, // keep showing last data while refetching
    });
}