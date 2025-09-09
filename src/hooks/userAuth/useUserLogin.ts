import { baseError, baseResponse, LoginFormValues } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify";


export const useUserLogin = () => {
    return useMutation({
        mutationFn: async (body: LoginFormValues) => {
            const { data } = await axiosInstance.post<baseResponse>("/user/login", body);
            return data;
        },
        onSuccess: (data: baseResponse) => {
            console.log(data);
            toast.success(data.message);
            // Set the token to global state
        },
        onError: (error: baseError) => {
            console.log(error);
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}