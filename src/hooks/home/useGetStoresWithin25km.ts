import { calculateDistance } from "@/functions/calculateDistance";
import { useActualLocationStore } from "@/store/useLocationStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

type Store = {
    id: string;
    name: string;
    address: string;
    lat: string;
    lng: string;
};

type Res = { status: string; message: string; data: Store[] };

export const useGetStoresWithin25km = (accessToken: string) => {
    const { actualLatitude, actualLongitude } = useActualLocationStore();

    return useQuery({
        queryKey: ["storesWithin25km", actualLatitude, actualLongitude],
        queryFn: async () => {
            const { data } = await axiosInstance.get<Res>(
                "/geocoding/get-all-store", { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const filtered = data.data
                .map((s) => ({
                    ...s,
                    distance: calculateDistance(
                        actualLatitude!,
                        actualLongitude!,
                        Number(s.lat),
                        Number(s.lng)
                    ),
                }))
                .filter((s) => s.distance <= 25_000); // ≤ 25 km

            return filtered;
        },
        enabled: !!actualLatitude && !!actualLongitude,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};