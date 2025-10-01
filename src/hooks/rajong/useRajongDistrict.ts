import { useQuery } from "@tanstack/react-query";
import { Option } from "./types";
import { axiosInstance } from "@/utils/axiosInstance";

export const useRajongDistrict = (cityId: string) => useQuery({
    queryKey: ["rajong-district", cityId],
    queryFn: async () => {
        const res = await axiosInstance.get<{
            status: string;
            data: { meta: unknown; data: Option[] };
        }>(`/geocoding/rajong-district?cityId=${cityId}`);
        return res.data.data.data; // ← inner array
    },
    enabled: !!cityId,
    retry: 0,
    refetchOnWindowFocus: false,
});