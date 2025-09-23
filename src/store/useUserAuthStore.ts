import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface userAuthStore {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    targetStoreId?: string | null;
    setAuth: (payload: Omit<userAuthStore, 'setAuth' | 'clearAuth'>) => void;
    clearAuth: () => void;
}

export const useUserAuthStore = create<userAuthStore>()(
    persist(
        (set) => ({
            id: '',
            name: '',
            email: '',
            accessToken: '',
            targetStoreId: null,
            setAuth: (payload) => set(payload),
            clearAuth: () => set({ id: '', name: '', email: '', accessToken: '', targetStoreId: null }),
        }),
        {
            name: 'user-auth-store', // <- unique key, NOT "state"
            storage: createJSONStorage(() => localStorage),
        }
    )
);