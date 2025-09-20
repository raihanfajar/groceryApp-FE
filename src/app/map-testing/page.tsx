"use client";

import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("./MapLeaflet"), {
  ssr: false,
});

export default function MapPage() {
  return (
    <div className="scaledown mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
        Pick a Location
      </h1>
      <MapLeaflet />
    </div>
  );
}
