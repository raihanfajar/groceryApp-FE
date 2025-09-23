"use client";

import { useForwardGeocode } from "@/hooks/geocoding/useForwardGeoCode";
import { useReverseGeocode } from "@/hooks/geocoding/useReverseGeoCode";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "../../ui/input";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// typed global for leaflet
declare global {
  interface Window {
    __LEAFLET_MAP__?: import("leaflet").Map;
  }
}

type Suggestion = {
  place_id: number | string;
  lat: string;
  lon: string;
  display_name: string;
};

type MapLeafletProps = {
  onLocationChange?: (lat: number, lon: number) => void;
};

export default function MapLeaflet({ onLocationChange }: MapLeafletProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  // geocode hooks (keep your hooks as-is)
  const {
    data: geoInfo,
    isPending,
    isError,
  } = useReverseGeocode(position?.lat ?? null, position?.lng ?? null);
  const { data: suggestions } = useForwardGeocode(search, 5);

  // safely cast suggestions to the typed array (hooks likely return similar shape)
  const suggestionsTyped = (suggestions as Suggestion[] | undefined) ?? [];

  const handleSelectSuggestion = (lat: string, lon: string) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latNum, lonNum], 15);
    }

    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    markerRef.current = L.marker([latNum, lonNum]).addTo(
      mapInstanceRef.current as L.Map,
    );

    setPosition({ lat: latNum, lng: lonNum });
    onLocationChange?.(latNum, lonNum);
    setSearch("");
  };

  const handleSearchClick = () => {
    if (suggestionsTyped.length > 0) {
      const first = suggestionsTyped[0];
      handleSelectSuggestion(first.lat, first.lon);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (ready && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([-6.2, 106.8], 11);
      mapInstanceRef.current = map;

      // store to typed global so parent can call invalidateSize without `any`
      window.__LEAFLET_MAP__ = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(map);

      // give some time for dialog to finish animation/layout then invalidate
      setTimeout(() => map.invalidateSize(), 500);

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        markerRef.current = L.marker([lat, lng]).addTo(map);

        setPosition({ lat, lng });
        onLocationChange?.(lat, lng);
      });
    }
  }, [ready, onLocationChange]);

  return (
    <div className="flex w-full flex-col items-center">
      {/* Search Input */}
      <div className="relative mr-auto mb-4 flex w-[100%] flex-col">
        <div className="flex !text-sm">
          <Input
            type="search"
            placeholder="Search for location..."
            className="h-[32px] rounded-r-none border border-r-0 border-gray-300 bg-white font-mono text-black focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex items-center justify-center rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700"
          >
            <FiSearch className="h-[18px]" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {search && suggestionsTyped.length > 0 && (
          <ul className="absolute top-[34px] z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow">
            {suggestionsTyped.map((s) => (
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
        className="z-10 h-[300px] w-full rounded-xl border border-gray-300 shadow"
      />

      {/* Lat / Lng info */}
      <div className="mt-2 w-full text-left text-xs text-gray-500">
        {position ? (
          <div>
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
