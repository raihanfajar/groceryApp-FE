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