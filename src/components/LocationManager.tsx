"use client";
import { useReverseGeocode } from "@/hooks/geocoding/useReverseGeoCode";
import {
  useActualLocationStore,
  useDynamicLocationStore,
} from "@/store/useLocationStore";
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

  // !Actual Setup
  const actualLat = useActualLocationStore((s) => s.actualLatitude);
  const actualLon = useActualLocationStore((s) => s.actualLongitude);
  const setActualLocation = useActualLocationStore((s) => s.setLocation);
  const setActualDisplayName = useActualLocationStore((s) => s.setDisplayName);

  // !Set client flag to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // !watchPosition to keep coordinates updated FOR DYNAMIC LOCATION
  useEffect(() => {
    console.log(`Actual: ${actualLat}, ${actualLon}`);
    console.log(`Dynamic: ${dynamicLat}, ${dynamicLon}`);

    if (!isClient || typeof navigator === "undefined") return;

    if (!actualLat || !actualLon) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setDynamicLocation(pos.coords.latitude, pos.coords.longitude);
          console.log(`Dynamic insdie useEffect: ${dynamicLat}, ${dynamicLon}`);
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
    } else {
      setActualLocation(actualLat, actualLon);
    }
  }, [
    actualLat,
    actualLon,
    dynamicLat,
    dynamicLon,
    setActualLocation,
    setDynamicLocation,
    setPermission,
    isClient,
  ]);

  // !WHERE THE REVERSE GEOCODE HOOK RUN
  const { data: actualGeoInfo } = useReverseGeocode(actualLat, actualLon);
  const { data: dynamicGeoInfo } = useReverseGeocode(dynamicLat, dynamicLon);

  // !When geoInfo changes, push the display name into the store
  useEffect(() => {
    if (actualGeoInfo?.display_name && actualLat && actualLon) {
      setActualDisplayName(actualGeoInfo?.display_name);
    } else if (dynamicGeoInfo?.display_name && dynamicLat && dynamicLon) {
      setDynamicDisplayName(dynamicGeoInfo?.display_name);
    }
  }, [
    actualLat,
    actualLon,
    dynamicLat,
    dynamicLon,
    actualGeoInfo,
    dynamicGeoInfo,
    setActualDisplayName,
    setDynamicDisplayName,
  ]);

  return null; // !NO UI BOSS
}
