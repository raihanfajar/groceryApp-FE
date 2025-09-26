import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface userAuthStore {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    targetStore?: { id: string; name: string; distanceKm: number } | null;
    setAuth: (payload: Omit<userAuthStore, 'setAuth' | 'clearAuth' | 'setTargetStore'>) => void;
    setTargetStore: (payload: userAuthStore['targetStore']) => void;
    clearAuth: () => void;
}

export const useUserAuthStore = create<userAuthStore>()(
    persist(
        (set) => ({
            id: '',
            name: '',
            email: '',
            accessToken: '',
            targetStore: null,
            setAuth: (payload) => set(payload),
            setTargetStore: (payload) => set({ targetStore: payload }),
            clearAuth: () => set({ id: '', name: '', email: '', accessToken: '', targetStore: null }),
        }),
        {
            name: 'user-auth-store', // <- unique key, NOT "state"
            storage: createJSONStorage(() => localStorage),
        }
    )
);