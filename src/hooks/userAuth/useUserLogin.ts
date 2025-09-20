import { baseError, baseUserResponse, LoginFormValues } from "@/components/userAuth/typesAndInterfaces";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export const useUserLogin = () => {
    const router = useRouter();
    const setUserAuth = useUserAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (body: LoginFormValues) => {
            const { data } = await axiosInstance.post<baseUserResponse>("/user/login", body);
            return data;
        },
        onSuccess: (data: baseUserResponse) => {
            console.log(data); //! Delete on production
            toast.success(data.message);
            // Set the token to global state
            setUserAuth({
                id: data.data.id,
                name: data.data.name,
                email: data.data.email,
                accessToken: data.data.accessToken,
            });
            router.push("/");
        },
        onError: (error: baseError) => {
            console.log(error); //! Delete on production
            toast.error(`${error.response.status} | ${error.response.data.message}`);
        }
    })
}