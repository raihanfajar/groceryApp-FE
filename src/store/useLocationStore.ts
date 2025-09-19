// stores/useLocationStore.ts
import { create } from 'zustand';

// stores/useLocationStore.ts
interface LocationState {
    dynamicLatitude: number | null;
    dynamicLongitude: number | null;
    displayName: string | null;
    permissionState: 'granted' | 'denied' | 'prompt' | null;
    setLocation: (lat: number, lon: number) => void;
    setDisplayName: (name: string | null) => void;
    setPermission: (state: 'granted' | 'denied' | 'prompt') => void;
    clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()((set) => ({
    dynamicLatitude: null,
    dynamicLongitude: null,
    displayName: null,
    permissionState: null,
    setLocation: (lat, lon) =>
        set({ dynamicLatitude: lat, dynamicLongitude: lon }),
    setDisplayName: (name) => set({ displayName: name }),
    setPermission: (state) => set({ permissionState: state }),
    clearLocation: () =>
        set({ dynamicLatitude: null, dynamicLongitude: null, displayName: null }),
}));

