import { baseError } from "@/components/userAuth/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { baseGeoResponse } from "../geocoding/typesAndInterfaces";
import { AddNewAddressDialogRequest } from "@/components/homePage/typesAndInterfaces";
import { USER_ADDRESSES_QUERY_KEY } from "../checkout/getCheckoutData";

export const useAddNewAddress = (accessToken: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: AddNewAddressDialogRequest) => {
      const payload = {
        ...body,
        provinceId: Number(body.provinceId),
        cityId: Number(body.cityId),
        districtId: Number(body.districtId),
      };

      const { data } = await axiosInstance.post<baseGeoResponse>(
        "/geocoding/add-new-user-address",
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return data;
    },
    onSuccess: (data: baseGeoResponse) => {
      console.log(data); // !Delete on production
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["userAddressInfo"] });
      queryClient.invalidateQueries({ queryKey: ["rajong-province"] });
      queryClient.invalidateQueries({ queryKey: ["rajong-city"] });
      queryClient.invalidateQueries({ queryKey: ["rajong-district"] });
      queryClient.invalidateQueries({ queryKey: USER_ADDRESSES_QUERY_KEY});
    },
    onError: (error: baseError) => {
      console.log(error); // !Delete on production
      toast.error(`${error.response.status} | ${error.response.data.message}`);
    },
  });
};
