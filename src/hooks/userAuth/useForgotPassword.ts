import { baseError, baseUserResponse } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";


export const useUserForgotPassword = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const { data } = await axiosInstance.post<baseUserResponse>("/user/forgot-password", { email });
            return data;
        },
        onSuccess: (data: baseUserResponse) => {
            console.log(data);
            toast.success(data.message);
        },
        onError: (error: baseError) => {
            console.log(error);
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}