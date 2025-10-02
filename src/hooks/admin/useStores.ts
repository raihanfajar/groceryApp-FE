import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
}

interface StoresResponse {
  data: Store[];
}

export const useStores = () => {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axiosInstance.get<StoresResponse>(
        "/admin/stores",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.data;
    },
    enabled: !!token && !!admin?.isSuper,
  });
};
