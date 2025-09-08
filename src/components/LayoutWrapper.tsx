"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  //! HIDE NAV PADA ROUTE DAN LANJUTAN-NYA
  const hideLayoutNavOn = ["/verify-user-email", "/reset-password-user"];

  //! HIDE FOOTER PADA ROUTE DAN LANJUTAN-NYA
  const hideLayoutFootOn = ["/verify-user-email", "/reset-password-user"];

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
