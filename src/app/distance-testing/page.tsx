// // DistanceCalculator.tsx
// "use client";
// import L from "leaflet";
// import React, { useState } from "react";

// const DistanceCalculator = () => {
//   const [lat1, setLat1] = useState("52.52");
//   const [lng1, setLng1] = useState("13.405");
//   const [lat2, setLat2] = useState("48.8566");
//   const [lng2, setLng2] = useState("2.3522");

//   const [distanceKm, setDistanceKm] = useState<number | null>(null);
//   const [error, setError] = useState("");

//   const handleCalc = () => {
//     setError("");
//     const n1 = Number(lat1);
//     const n2 = Number(lng1);
//     const n3 = Number(lat2);
//     const n4 = Number(lng2);

//     if ([n1, n2, n3, n4].some(Number.isNaN)) {
//       setError("Please enter valid numbers for all coordinates.");
//       return;
//     }

//     const metres = L.latLng(n1, n2).distanceTo(L.latLng(n3, n4));
//     setDistanceKm(metres / 1000);
//   };

//   return (
//     <div className="h-[calc(100vh)]">
//       <div className="mx-auto mt-10 max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-lg">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Distance Calculator
//         </h2>

//         {/* Point A */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Point A – lat / lng
//           </label>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={lat1}
//               onChange={(e) => setLat1(e.target.value)}
//               placeholder="lat"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//             />
//             <input
//               type="text"
//               value={lng1}
//               onChange={(e) => setLng1(e.target.value)}
//               placeholder="lng"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//             />
//           </div>
//         </div>

//         {/* Point B */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Point B – lat / lng
//           </label>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={lat2}
//               onChange={(e) => setLat2(e.target.value)}
//               placeholder="lat"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//             />
//             <input
//               type="text"
//               value={lng2}
//               onChange={(e) => setLng2(e.target.value)}
//               placeholder="lng"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleCalc}
//           className="w-full rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
//         >
//           Calculate distance
//         </button>

//         {error && <p className="text-sm text-red-600">{error}</p>}

//         {distanceKm !== null && (
//           <p className="text-lg font-semibold text-gray-800">
//             Distance:{" "}
//             <span className="text-indigo-600">{distanceKm.toFixed(2)} km</span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DistanceCalculator;

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
