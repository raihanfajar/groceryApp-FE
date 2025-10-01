import { baseUserResponse } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";


const fetchUserProfileInfo = async (accessToken: string) => {
    // call your backend route
    const { data } = await axiosInstance.get<baseUserResponse>(`/user/session-login`, { headers: { Authorization: `Bearer ${accessToken}` } });
    console.log("data log from useGetUserProfileInfo", data);
    return data.data;
}

export const useGetUserProfileInfo = (accessToken: string) => {
    return useQuery({
        queryKey: ["userProfileInfo", accessToken],
        queryFn: () => fetchUserProfileInfo(accessToken),
        enabled: !!accessToken, // don’t run until both exist
        staleTime: 5 * 60 * 1000, // optional caching
        retry: 1, // only retry once if fails
        placeholderData: (previous) => previous, // keep showing last data while refetching
    });
}