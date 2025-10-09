import { baseError, baseUserResponse, RegisterFormValues } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export const useUserRegister = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (body: Omit<RegisterFormValues, "confirmPassword">) => {
            const { data } = await axiosInstance.post<baseUserResponse>("/user/register", body);
            return data;
        },
        onSuccess: (data: baseUserResponse) => {
            toast.success(data.message);
            toast.success(`Verification link sent to ${data.data?.email}`, { autoClose: false });
            router.push("/user-login");
        },
        onError: (error: baseError) => {
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}