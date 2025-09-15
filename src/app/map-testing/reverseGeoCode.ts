// export const reverseGeoCode = async (lat: number, lng: number, setAddress: (address: string) => void) => async () => {
//     try {
//         const r = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
//         );
//         const json = await r.json();
//         setAddress(json.display_name || json.address?.city || "Unknown");
//     } catch (err) {
//         console.error("reverse geocode failed", err);
//     }
// }