import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AdminAuthStore, AdminAuthState } from "@/types/admin/adminAuth";

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      admin: null,

      setAuth: (auth: AdminAuthState) => {
        set({ admin: auth });
      },

      logout: () => {
        set({ admin: null });
      },

      isAuthenticated: () => {
        const admin = get().admin;
        return admin !== null && admin.accessToken !== "";
      },

      isSuperAdmin: () => {
        const admin = get().admin;
        return admin !== null && admin.isSuper === true;
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({ admin: state.admin }),
    },
  ),
);
