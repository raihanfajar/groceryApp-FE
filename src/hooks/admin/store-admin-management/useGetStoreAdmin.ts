import { StoreAdmin } from "@/components/admin/users/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query"

export const useGetStoreAdmin = (accessToken: string | null | undefined) => useQuery({
    queryKey: ["storeAdmins"],
    queryFn: async () => {
        const response = await axiosInstance.get("/admin/store-admins", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = (
            response.data as { data: { admins: StoreAdmin[]; count: number } }
        ).data;
        return Array.isArray(data.admins) ? data.admins : [];
    },
    enabled: !!accessToken,
});