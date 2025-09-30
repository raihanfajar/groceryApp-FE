import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Option } from "./types";

export const useRajongCity = (provinceId: string) => useQuery({
    queryKey: ["rajong-city", provinceId],
    queryFn: async () => {
        const res = await axiosInstance.get<{
            status: string;
            data: { meta: unknown; data: Option[] };
        }>(`/geocoding/rajong-city?provinceId=${provinceId}`);
        return res.data.data.data; // ← inner array
    },
    enabled: !!provinceId,
    retry: 0,
    refetchOnWindowFocus: false,
});