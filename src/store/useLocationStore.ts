// stores/useLocationStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// stores/useLocationStore.ts
interface DynamicLocationState {
    dynamicLatitude: number | null;
    dynamicLongitude: number | null;
    dynamicDisplayName: string | null;
    permissionState: 'granted' | 'denied' | 'prompt' | null;
    setLocation: (lat: number, lon: number) => void;
    setDisplayName: (name: string | null) => void;
    setPermission: (state: 'granted' | 'denied' | 'prompt') => void;
    clearLocation: () => void;
}

export const useDynamicLocationStore = create<DynamicLocationState>()((set) => ({
    dynamicLatitude: null,
    dynamicLongitude: null,
    dynamicDisplayName: null,
    permissionState: null,
    setLocation: (lat, lon) =>
        set({ dynamicLatitude: lat, dynamicLongitude: lon }),
    setDisplayName: (name) => set({ dynamicDisplayName: name }),
    setPermission: (state) => set({ permissionState: state }),
    clearLocation: () =>
        set({ dynamicLatitude: null, dynamicLongitude: null, dynamicDisplayName: null }),
}));

interface ActualLocationState {
    actualLatitude: number | null;
    actualLongitude: number | null;
    actualDisplayName: string | null;
    label: string | null;
    setLocation: (lat: number, lon: number) => void;
    setDisplayName: (name: string | null) => void;
    setLabel: (label: string | null) => void;
    clearLocation: () => void;
}

export const useActualLocationStore = create<ActualLocationState>()(
    persist(
        (set) => ({
            actualLatitude: null,
            actualLongitude: null,
            actualDisplayName: null,
            label: null,
            setLocation: (lat, lon) => set({ actualLatitude: lat, actualLongitude: lon }),
            setDisplayName: (name) => set({ actualDisplayName: name }),
            setLabel: (label) => set({ label }),
            clearLocation: () =>
                set({
                    actualLatitude: null,
                    actualLongitude: null,
                    actualDisplayName: null, // <-- null, not ""
                    label: null,
                }),
        }),
        {
            name: 'actual-location',
            partialize: (state) => ({
                actualLatitude: state.actualLatitude,
                actualLongitude: state.actualLongitude,
                actualDisplayName: state.actualDisplayName, // null is now written
                label: state.label,
            }),
            storage: createJSONStorage(() => localStorage),
        },
    ),
);