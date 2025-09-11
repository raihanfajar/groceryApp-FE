"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

// 👇 Fix marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);

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

      // ensure proper draw
      setTimeout(() => map.invalidateSize(), 200);

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`)
          .openPopup();
      });
    }
  }, [ready]);

  return (
    <div
      ref={mapRef}
      className="block h-[500px] w-full bg-pink-200"
      style={{ minHeight: "500px" }}
    />
  );
}
