"use client";
import { Input } from "@/components/ui/input";
import { useForwardGeocode } from "@/hooks/geocoding/useForwardGeoCode";
import { useReverseGeocode } from "@/hooks/geocoding/useReverseGeoCode";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
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

  const [search, setSearch] = useState("");

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const [ready, setReady] = useState(false);

  // !HOOKS
  const {
    data: geoInfo,
    isPending,
    isError,
  } = useReverseGeocode(position?.lat ?? null, position?.lng ?? null);
  const { data: suggestions } = useForwardGeocode(search, 5);

  // !HANDLERS (REFACTOR?)
  const handleSelectSuggestion = (lat: string, lon: string) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    // Move map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latNum, lonNum], 15);
    }

    // Remove old marker if exists
    if (markerRef.current) {
      mapInstanceRef.current?.removeLayer(markerRef.current);
    }

    // Add new marker
    markerRef.current = L.marker([latNum, lonNum]).addTo(
      mapInstanceRef.current!,
    );

    setPosition({ lat: latNum, lng: lonNum });

    // Optionally clear search after selecting
    setSearch("");
  };

  // inside MapLeaflet.tsx
  const handleSearchClick = () => {
    if (suggestions && suggestions.length > 0) {
      const first = suggestions[0];
      handleSelectSuggestion(first.lat, first.lon);
    }
  };

  // !USE EFFECT STUFFS (REFACTOR?)
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
      <div className="relative mr-auto mb-4 flex w-[40%] flex-col">
        <div className="flex">
          <Input
            type="search"
            placeholder="Search for location..."
            className="!text-md h-[32px] rounded-r-none border border-r-0 border-gray-300 bg-white font-mono text-black focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => handleSearchClick()} // !ASK CHATGPT HOW TO HANDLE THIS? THIS IS JUST LIKE REGULAR SEARCHING NOT WITH SUGGESTION
            className="flex items-center justify-center rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700"
          >
            <FiSearch className="h-[32px]" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {search && suggestions && suggestions.length > 0 && (
          <ul className="absolute top-[34px] z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                onClick={() => handleSelectSuggestion(s.lat, s.lon)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
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
