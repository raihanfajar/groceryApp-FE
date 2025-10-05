"use client";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(
  () => import("@/components/homePage/location/MapLeaflet"),
  {
    ssr: false,
    loading: () => <p className="text-sm text-gray-500">Loading map…</p>,
  },
);

export default MapLeaflet;
