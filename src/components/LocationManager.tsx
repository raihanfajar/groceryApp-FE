"use client";
import { useReverseGeocode } from "@/hooks/geocoding/useReverseGeoCode";
import { useDynamicLocationStore } from "@/store/useLocationStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LocationManager() {
  const [isClient, setIsClient] = useState(false);

  // !Dynamic Setup
  const dynamicLat = useDynamicLocationStore((s) => s.dynamicLatitude);
  const dynamicLon = useDynamicLocationStore((s) => s.dynamicLongitude);
  const setDynamicLocation = useDynamicLocationStore((s) => s.setLocation);
  const setPermission = useDynamicLocationStore((s) => s.setPermission);
  const setDynamicDisplayName = useDynamicLocationStore(
    (s) => s.setDisplayName,
  );

  // !Set client flag to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // !watchPosition to keep coordinates updated
  useEffect(() => {
    if (!isClient || typeof navigator === "undefined") return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setDynamicLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => console.error("Error getting location:", err),
      { enableHighAccuracy: true },
    );

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setPermission(result.state as "granted" | "prompt" | "denied");

      if (result.state !== "granted") {
        toast.error(
          "Can't access location. Please allow browser location access.",
          { autoClose: false },
        );
      }

      result.onchange = () => {
        setPermission(result.state as "granted" | "prompt" | "denied");
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition((pos) =>
            setDynamicLocation(pos.coords.latitude, pos.coords.longitude),
          );
        }
        window.location.reload();
      };
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setDynamicLocation, setPermission, isClient]);

  // !WHERE THE REVERSE GEOCODE HOOK RUN
  const { data: dynamicGeoInfo } = useReverseGeocode(dynamicLat, dynamicLon);

  // !When geoInfo changes, push the display name into the store
  useEffect(() => {
    if (dynamicGeoInfo?.display_name) {
      setDynamicDisplayName(dynamicGeoInfo?.display_name);
    }
  }, [dynamicGeoInfo, setDynamicDisplayName]);

  return null; // !NO UI BOSS
}
