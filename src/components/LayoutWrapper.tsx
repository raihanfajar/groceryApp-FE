"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  //! HIDE NAV PADA ROUTE DAN LANJUTAN-NYA
  const hideLayoutNavOn = ["/verify-user-email"];

  //! HIDE FOOTER PADA ROUTE DAN LANJUTAN-NYA
  const hideLayoutFootOn = ["/verify-user-email"];

  const shouldHideNav = hideLayoutNavOn.some((route) =>
    pathname.startsWith(route),
  );
  const shouldHideFoot = hideLayoutFootOn.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <>
      {!shouldHideNav && <Navbar />}
      {children}
      {!shouldHideFoot && <Footer />}
    </>
  );
}
