// !STORE MANAGEMENT
export interface DetailedStoreInfo {
    id: string;
    provinceId: number;
    province: string;
    cityId: number;
    city: string;
    district: string;
    districtId: number;
    address: string;
    name: string;
    lat: string;
    lng: string;
    radiusKm: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface storeResponse {
    status: string;
    message: string;
    data: DetailedStoreInfo[];
}

export interface StoreFormData {
    name: string;
    city: string;
    province: string;
    district: string;
    lat: string;
    lng: string;
}

// !STORE ADMIN MANAGEMENT
export interface Store {
    id: string;
    name: string;
    city: string;
    province: string;
}

export interface StoreAdmin {
    id: string;
    name: string;
    email: string;
    isSuper: boolean;
    storeId: string | null;
    store: Store | null;
    createdAt: string;
}

export interface CreateStoreAdminData {
    name: string;
    email: string;
    password: string;
    storeId: string;
}