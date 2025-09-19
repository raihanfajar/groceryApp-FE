// useUpdateUserProfileInfo.ts
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UpdateProfilePayload, UpdateUserInfoResponse } from "./typesAndInterfaces";

export const useUpdateUserProfileInfo = (accessToken: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            const { data } = await axiosInstance.patch<UpdateUserInfoResponse>(
                "/user/update-user-profile-info",
                payload,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return data;
        },
        onSuccess: (data) => {
            // ✅ React Query v5 syntax
            queryClient.invalidateQueries({ queryKey: ["userProfileInfo"] });

            if (data.emailChanged === true) {
                // Handle email change here (logout / toast / redirect)
                toast.info(data.message);
            } else {
                toast.success(data.message);
            }
        },
    });
};
