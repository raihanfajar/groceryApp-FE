import { useEffect, useState } from "react";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

/**
 * Custom hook to safely handle auth state during hydration
 * Prevents hydration mismatch by ensuring server and client render the same content initially
 */
export function useHydratedUserAuth() {
  const [isHydrated, setIsHydrated] = useState(false);
  const userAuth = useUserAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Return default values during SSR/initial render, actual values after hydration
  return {
    ...userAuth,
    isHydrated,
    name: isHydrated ? userAuth.name : "",
    email: isHydrated ? userAuth.email : "",
    accessToken: isHydrated ? userAuth.accessToken : "",
    isAuthenticated: isHydrated && !!userAuth.accessToken,
  };
}

/**
 * Custom hook to safely handle admin auth state during hydration
 */
export function useHydratedAdminAuth() {
  const [isHydrated, setIsHydrated] = useState(false);
  const adminAuth = useAdminAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Return safe values during SSR/initial render
  return {
    ...adminAuth,
    isHydrated,
    admin: isHydrated ? adminAuth.admin : null,
    isAuthenticated: () => isHydrated && adminAuth.isAuthenticated(),
    isSuperAdmin: () => isHydrated && adminAuth.isSuperAdmin(),
  };
}
