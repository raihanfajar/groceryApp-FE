"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

// 👇 Fix marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useReverseGeocode } from "@/hooks/rgc/useReverseGeoCode";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export default function MapLeaflet() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  // const [address, setAddress] = useState<string | null>(null);

  const [ready, setReady] = useState(false);

  // !HOOK
  const {
    data: geoInfo,
    isPending,
    isError,
  } = useReverseGeocode(position?.lat ?? null, position?.lng ?? null);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (ready && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([-6.2, 106.8], 11);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      setTimeout(() => map.invalidateSize(), 200);

      map.on("click", async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // Remove old marker if exists
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(map);

        // Update React state
        setPosition({ lat, lng });
      });
    }
  }, [ready]);

  return (
    <div className="flex w-full flex-col items-center">
      {/* Search Input */}
      <div className="mr-auto mb-4 flex w-[40%]">
        <Input
          type="search"
          placeholder="Search for location..."
          className="!text-md h-[32px] rounded-r-none border border-r-0 border-gray-300 bg-white font-mono text-black focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <button className="flex items-center justify-center rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700">
          <FiSearch className="h-[32px]" />
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="z-10 h-[300px] w-full rounded-xl border border-gray-300 shadow sm:h-[400px]"
      />

      {/* Lat / Lng info */}
      <div className="mt-4 w-full rounded-md bg-gray-50 p-4 text-center shadow sm:w-2/3 md:w-1/2">
        {position ? (
          <div className="text-sm sm:text-base">
            <p>
              <span className="font-semibold">Lat:</span>{" "}
              {position.lat.toFixed(5)}
            </p>
            <p>
              <span className="font-semibold">Lng:</span>{" "}
              {position.lng.toFixed(5)}
            </p>
            {isPending ? (
              <p>Loading address...</p>
            ) : isError ? (
              <p className="text-red-500">Failed to load address</p>
            ) : (
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {geoInfo?.display_name ?? "Unknown"}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Tap anywhere on the map.</p>
        )}
      </div>
    </div>
  );
}
