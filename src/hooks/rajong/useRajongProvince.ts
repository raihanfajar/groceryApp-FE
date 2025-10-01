import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Option } from "./types";


export const useRajongProvince = () => useQuery({
    queryKey: ["rajong-province"],
    queryFn: async () => {
        const res = await axiosInstance.get<{
            status: string;
            data: { meta: unknown; data: Option[] };
        }>("/geocoding/rajong-province");
        return res.data.data.data; // ← third .data is the array
    },
    retry: 0,
    refetchOnWindowFocus: false,
});