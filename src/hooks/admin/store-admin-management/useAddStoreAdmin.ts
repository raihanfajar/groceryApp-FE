import { CreateStoreAdminData } from "@/components/admin/users/typesAndInterfaces";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAddStoreAdmin = (accessToken: string | null | undefined) =>
  useMutation({
    mutationFn: async (data: CreateStoreAdminData) => {
      const response = await axiosInstance.post("/admin/store-admins", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Store admin created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      alert("Error creating store admin: " + errorMessage);
    },
  });
