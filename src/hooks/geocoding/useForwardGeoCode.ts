import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { baseForwardGeoResponse } from "./typesAndInterfaces";

const fetchForwardGeoInfo = async (q: string, limit: number = 5) => {
    const { data } = await axiosInstance.get<baseForwardGeoResponse>(
        `/geocoding/fgc?q=${encodeURIComponent(q)}&limit=${limit}`
    );
    return data.data;
};

/**
 * Hook for forward geocoding (search by address).
 * @param q — query string (address or place name)
 * @param limit — how many results to return (default 5)
 */
export const useForwardGeocode = (q: string | null, limit = 5) => {
    return useQuery({
        queryKey: ["forwardGeoInfo", q, limit],
        queryFn: () => fetchForwardGeoInfo(q!, limit),
        enabled: !!q && q.trim().length > 0, // run only if q exists
        staleTime: 5 * 60 * 1000,
        retry: 1,
        placeholderData: (previous) => previous,
    });
};