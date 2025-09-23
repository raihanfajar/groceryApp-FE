export interface GeoInfo {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    category: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address?: {
        suburb?: string;
        city_district?: string;
        city?: string;
        state?: string;
        ISO3166_2_lvl4?: string;
        region?: string;
        ISO3166_2_lvl3?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
        regency?: string;
        village?: string;
    };
    boundingbox: string[];
}
export interface baseGeoResponse {
    status: string;
    message: string;
    data: GeoInfo;
}

export interface baseForwardGeoResponse {
    status: string;
    message: string;
    data: GeoInfo[];
}

export interface userAddressInfo {
    id: string;
    addressLabel: string;
    receiverName: string;
    receiverPhoneNumber: string;
    addressDisplayName: string;
    addressDetails: string;
    lat: string;
    lon: string;
    isDefault: boolean;
    provinceId: number;
    province: string;
    cityId: number;
    city: string;
    district: string;
    districtId: number
}

export interface baseGetUserAddressResponse {
    status: string;
    message: string;
    data: userAddressInfo[];
}