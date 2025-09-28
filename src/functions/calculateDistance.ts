// import L from "leaflet";

// export const calculateDistance = (actualLat: number, actualLon: number, storeLat: number, storeLon: number) => {
//     const distance = L.latLng(actualLat, actualLon).distanceTo(L.latLng(storeLat, storeLon));
//     return distance;
// };

const R = 6_371_000; // Earth radius (m)

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // metres
};