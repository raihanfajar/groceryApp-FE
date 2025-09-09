import { baseError, baseUserResponse, RegisterFormValues } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";


export const useUserRegister = () => {
    return useMutation({
        mutationFn: async (body: Omit<RegisterFormValues, "confirmPassword">) => {
            const { data } = await axiosInstance.post<baseUserResponse>("/user/register", body);
            return data;
        },
        onSuccess: (data: baseUserResponse) => {
            toast.success(data.message);
            toast.success(`Verification link sent to ${data.data?.email}`, { autoClose: false });
        },
        onError: (error: baseError) => {
            console.log(error);
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}