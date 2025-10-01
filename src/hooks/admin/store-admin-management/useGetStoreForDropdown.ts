import { Store } from "@/components/admin/users/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetStoreForDropdown = (accessToken: string | null | undefined) => useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
        const response = await axiosInstance.get("/admin/stores", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Stores response:", response.data);
        const data = (response.data as { data: Store[] }).data;
        return Array.isArray(data) ? data : [];
    },
    enabled: !!accessToken,
});