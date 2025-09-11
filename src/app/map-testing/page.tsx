"use client";

import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("./MapLeaflet"), {
  ssr: false, // 👈 disables server-side rendering for this component
});

export default function MapPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-xl font-bold">Pick a Location</h1>
      <MapLeaflet />
    </div>
  );
}
