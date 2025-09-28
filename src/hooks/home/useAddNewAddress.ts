import { baseError } from "@/components/userAuth/typesAndInterfaces"
import { axiosInstance } from "@/utils/axiosInstance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { baseGeoResponse } from "../geocoding/typesAndInterfaces"
import { AddNewAddressDialogRequest } from "@/components/homePage/typesAndInterfaces"

export const useAddNewAddress = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: AddNewAddressDialogRequest) => {
      const { data } = await axiosInstance.post<baseGeoResponse>(
        "/geocoding/add-new-user-address",
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data;
    },
    onSuccess: (data: baseGeoResponse) => {
      console.log(data); // !Delete on production
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["userAddressInfo"] });
    },
    onError: (error: baseError) => {
      console.log(error); // !Delete on production
      toast.error(`${error.response.status} | ${error.response.data.message}`);
    },
  });
};
