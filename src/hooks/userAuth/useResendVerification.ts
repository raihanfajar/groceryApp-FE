import { baseError, baseUserResponse } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useResendVerification = () => {

    return useMutation({
        mutationFn: async (email: string) => {
            const { data } = await axiosInstance.post<baseUserResponse>("/user/resend-verification", { email });
            return data;
        },
        onSuccess: (data: baseUserResponse) => {
            console.log(data); //! Delete on production
            toast.success(data.message);
        },
        onError: (error: baseError) => {
            console.log(error); //! Delete on production
            toast.error(`${error.response.status} | ${error.response.data.message}` || "Something went wrong");
        }
    })
}