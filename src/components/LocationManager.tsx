"use client";
import { useReverseGeocode } from "@/hooks/geocoding/useReverseGeoCode";
import { useGetNearestStore } from "@/hooks/home/useGetNearestStore";
import { useGetUserAddressInfo } from "@/hooks/home/useGetUserAddress";
import {
  useActualLocationStore,
  useDynamicLocationStore,
} from "@/store/useLocationStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LocationManager() {
  const [isClient, setIsClient] = useState(false);
  const { accessToken, setTargetStore } = useUserAuthStore();

  const { data: locationArray } = useGetUserAddressInfo(accessToken);
  const defaultLocation = locationArray?.find(
    (item) => item.isDefault === true,
  );

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
  const setActualLabel = useActualLocationStore((s) => s.setLabel);

  // !Set client flag to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // !watchPosition to keep coordinates updated FOR DYNAMIC LOCATION
  useEffect(() => {
    console.log(`Actual: ${actualLat}, ${actualLon}`);
    console.log(`Dynamic: ${dynamicLat}, ${dynamicLon}`);

    if (!isClient || typeof navigator === "undefined") return;
    if (defaultLocation) return;

    if (!actualLat || !actualLon) {
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
    } else {
      setActualLocation(actualLat, actualLon);
    }
  }, [
    defaultLocation,
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
    if (defaultLocation) return;
    if (actualGeoInfo?.display_name && actualLat && actualLon) {
      setActualDisplayName(actualGeoInfo?.display_name);
    } else if (dynamicGeoInfo?.display_name && dynamicLat && dynamicLon) {
      setDynamicDisplayName(dynamicGeoInfo?.display_name);
    }
  }, [
    defaultLocation,
    actualLat,
    actualLon,
    dynamicLat,
    dynamicLon,
    actualGeoInfo,
    dynamicGeoInfo,
    setActualDisplayName,
    setDynamicDisplayName,
  ]);

  useEffect(() => {
    if (defaultLocation) {
      setActualLocation(
        Number(defaultLocation.lat),
        Number(defaultLocation.lon),
      );
      setActualDisplayName(defaultLocation.addressDisplayName);
      setActualLabel(defaultLocation.addressLabel);
    }
  }, [
    defaultLocation,
    setActualLocation,
    setActualDisplayName,
    setActualLabel,
  ]);

  const { data: nearestStore } = useGetNearestStore(accessToken);
  if (nearestStore) {
    console.log(nearestStore);
  }

  useEffect(() => {
    if (nearestStore) {
      setTargetStore({
        id: nearestStore.store.id,
        name: nearestStore.store.name,
        distanceKm: nearestStore.distance / 1000,
      });
    }
  }, [nearestStore, setTargetStore]);

  return null; // !NO UI BOSS
}
