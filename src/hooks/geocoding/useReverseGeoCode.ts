import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { baseGeoResponse } from "./typesAndInterfaces";

const fetchGeoInfo = async (lat: number, lon: number) => {
    // call your backend route
    const { data } = await axiosInstance.get<baseGeoResponse>(`/geocoding/rgc?lat=${lat}&lon=${lon}`);
    return data.data;
}

export const useReverseGeocode = (lat: number | null, lon: number | null) => {
    return useQuery({
        queryKey: ["geoInfo", lat, lon],
        queryFn: () => fetchGeoInfo(lat!, lon!),
        enabled: !!lat && !!lon, // don’t run until both exist
        staleTime: 5 * 60 * 1000, // optional caching
        retry: 1, // only retry once if fails
        placeholderData: (previous) => previous, // keep showing last data while refetching
    });
}