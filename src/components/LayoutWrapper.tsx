"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import FullPageLoader from "./FullPageLoader";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showLoader, setShowLoader] = useState(true);
  const [canHide, setCanHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setCanHide(true); // allow fade-out after 2s
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // fade-out only when BOTH timer elapsed AND Suspense finished
  useEffect(() => {
    if (canHide) setShowLoader(false);
  }, [canHide]);

  //! HIDE NAV PADA ROUTE DAN LANJUTAN-NYA
  const hideLayoutNavOn = [
    "/verify-user-email",
    "/reset-password-user",
    "/login-success",
    "/ip-testing",
  ];

  //! HIDE FOOTER PADA ROUTE DAN LANJUTAN-NYA
  const hideLayoutFootOn = [
    "/verify-user-email",
    "/reset-password-user",
    "/login-success",
    "/map-testing",
    // "/ip-testing",
  ];

  const shouldHideNav = hideLayoutNavOn.some((route) =>
    pathname.startsWith(route),
  );
  const shouldHideFoot = hideLayoutFootOn.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <>
      {/* always mounted, fades when told */}
      <FullPageLoader
        show={showLoader}
        onFadeDone={() => {
          /* optional cleanup */
        }}
      />

      <Suspense fallback={null}>
        {" "}
        {/* no extra DOM, we already show loader above */}
        {!shouldHideNav && <Navbar />}
        {children}
        {!shouldHideFoot && <Footer />}
      </Suspense>
    </>
  );
}
