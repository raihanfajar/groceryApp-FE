import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface StoreProductCard {
    id: string;
    name: string;
    slug: string;
    price: number;
    picture1: string;
    weight: number;
    stock: number;
    category: {
        name: string;
        slug: string;
    };
    discount: null | {
        type: "MANUAL" | "MINIMUM_PURCHASE" | "BOGO" | "AUTOMATIC";
        valueType: "PERCENTAGE" | "NOMINAL";
        value: number;
        maxDiscountAmount: number | null;
    };
}

interface getAllTargetStoreProductsResponse {
    status: string;
    data: StoreProductCard[];
}

const fetchAllTargetStoreProducts = async (storeId: string | null | undefined) => {
    // call your backend route
    const { data } = await axiosInstance.get<getAllTargetStoreProductsResponse>(`/stores/products/${storeId}`);
    return data.data;
}

export const useGetAllTargetStoreProducts = (storeId: string | null | undefined) => {
    return useQuery({
        queryKey: ["targetStoreProductsInfo"],
        queryFn: () => fetchAllTargetStoreProducts(storeId),
        enabled: !!storeId, // don’t run until store id exist
        staleTime: 5 * 60 * 1000, // optional caching
        retry: 1, // only retry once if fails
        placeholderData: (previous) => previous, // keep showing last data while refetching
    });
}