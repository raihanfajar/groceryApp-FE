"use client";
import { useReverseGeocode } from "@/hooks/geocoding/useReverseGeoCode";
import { useLocationStore } from "@/store/useLocationStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LocationManager() {
  const [isClient, setIsClient] = useState(false);
  const dynamicLat = useLocationStore((s) => s.dynamicLatitude);
  const dynamicLon = useLocationStore((s) => s.dynamicLongitude);
  const setLocation = useLocationStore((s) => s.setLocation);
  const setPermission = useLocationStore((s) => s.setPermission);
  const setDisplayName = useLocationStore((s) => s.setDisplayName);

  // Set client flag to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // watchPosition to keep coordinates updated
  useEffect(() => {
    if (!isClient || typeof navigator === "undefined") return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude);
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
            setLocation(pos.coords.latitude, pos.coords.longitude),
          );
        }
        window.location.reload();
      };
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setLocation, setPermission, isClient]);

  // 🔹 Here is where we run the reverse geocode hook
  const { data: dynamicGeoInfo } = useReverseGeocode(dynamicLat, dynamicLon);

  // 🔹 When geoInfo changes, push the display name into the store
  useEffect(() => {
    if (dynamicGeoInfo?.display_name) {
      setDisplayName(dynamicGeoInfo?.display_name);
    }
    // else {
    //   setDisplayName("UNKNOWN");
    // }
  }, [dynamicGeoInfo, setDisplayName]);

  return null; // !NO UI BOSS
}
