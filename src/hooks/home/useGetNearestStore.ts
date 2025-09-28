import { calculateDistance } from "@/functions/calculateDistance";
import { useActualLocationStore } from "@/store/useLocationStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface storeInfo {
    id: string;
    provinceId: number;
    province: string;
    cityId: number;
    city: string;
    district: string;
    districtId: number;
    address: string;
    name: string;
    lat: string;
    lng: string;
    radiusKm: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface baseGetAllStoreResponse {
    status: string;
    message: string;
    data: storeInfo[];
}

export const useGetNearestStore = (accessToken: string) => {
    const { actualLatitude, actualLongitude } = useActualLocationStore();

    const fetchNearestStore = async (accessToken: string) => {
        let nearest: storeInfo | null = null;
        let minDistance = Infinity;
        // call your backend route
        const { data } = await axiosInstance.get<baseGetAllStoreResponse>(`/geocoding/get-all-store`, { headers: { Authorization: `Bearer ${accessToken}` } });
        for (const s of data.data) {
            const d = calculateDistance(actualLatitude!, actualLongitude!, Number(s.lat), Number(s.lng));
            if (d < minDistance) {
                minDistance = d;
                nearest = s;
            }
        }
        return { store: nearest!, distance: minDistance };
    }

    return useQuery({
        queryKey: ["nearestStore"],
        queryFn: () => fetchNearestStore(accessToken),
        enabled: !!accessToken && !!actualLatitude && !!actualLongitude, // don't run until three of them exist
        staleTime: 5 * 60 * 1000, // optional caching
        retry: 1, // only retry once if fails
        placeholderData: (previous) => previous, // keep showing last data while refetching
    });
}