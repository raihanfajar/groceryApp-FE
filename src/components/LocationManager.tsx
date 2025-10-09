"use client";
import { useReverseGeocode } from "@/hooks/geocoding/useReverseGeoCode";
import { useGetNearestStore } from "@/hooks/home/useGetNearestStore";
import { useGetUserAddressInfo } from "@/hooks/home/useGetUserAddress";
import {
  useActualLocationStore,
  useDynamicLocationStore,
} from "@/store/useLocationStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LocationManager() {
  const queryClient = useQueryClient();
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
    if (!isClient || typeof navigator === "undefined" || defaultLocation)
      return;

    // !nothing to do if we already have coords
    if (actualLat && actualLon) {
      setActualLocation(actualLat, actualLon);
      return;
    }

    let watchId: number | null = null;

    // 1. ask permission
    navigator.permissions.query({ name: "geolocation" }).then((res) => {
      setPermission(res.state as PermissionState);
      if (res.state === "denied") {
        toast.error(
          "Can't access location. Please allow browser location access.",
          {
            autoClose: false,
          },
        );
      }
    });

    // 2. start watching once
    watchId = navigator.geolocation.watchPosition(
      (pos) => setDynamicLocation(pos.coords.latitude, pos.coords.longitude),
      (err) => console.error("Geo error:", err),
      { enableHighAccuracy: true },
    );

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [
    isClient,
    defaultLocation,
    actualLat,
    actualLon,
    setActualLocation,
    setDynamicLocation,
    setPermission,
  ]);

  useEffect(() => {
    const handler = () => window.location.reload();
    navigator.permissions.query({ name: "geolocation" }).then((res) => {
      res.onchange = handler; // fires when permission state changes
    });
  }, []);

  /* 1. whenever we get the first valid fix, wipe the geo & store cache */
  useEffect(() => {
    if (!dynamicLat || !dynamicLon) return;
    queryClient.invalidateQueries({
      queryKey: ["geoInfo", dynamicLat, dynamicLon],
    });
    queryClient.invalidateQueries({
      queryKey: ["nearestStore", dynamicLat, dynamicLon],
    });
  }, [dynamicLat, dynamicLon, queryClient]);

  /* 2. same trick when actualLat/Lon arrive */
  useEffect(() => {
    if (!actualLat || !actualLon) return;
    queryClient.invalidateQueries({
      queryKey: ["geoInfo", actualLat, actualLon],
    });
    queryClient.invalidateQueries({
      queryKey: ["nearestStore", actualLat, actualLon],
    });
  }, [actualLat, actualLon, queryClient]); // ✅ simple, exhaustive

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

  useEffect(() => {
    if (!nearestStore) return;

    // !25km Guard
    if (nearestStore.distance > 25_000) {
      toast.error(
        "There is no available store within 25 km of your location.",
        { autoClose: false },
      );
      return;
    }

    setTargetStore({
      id: nearestStore.store.id,
      name: nearestStore.store.name,
      distanceKm: nearestStore.distance / 1000,
    });
  }, [nearestStore, setTargetStore]);

  return null; // !NO UI BOSS
}
