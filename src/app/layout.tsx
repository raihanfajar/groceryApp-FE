import LayoutWrapper from "@/components/LayoutWrapper";
import ReactQueryProvider from "@/providers/ReactQueryProviders";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Bounce, ToastContainer } from "react-toastify";
import "./globals.css";
import LocationManager from "@/components/LocationManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: { default: "FreshNear", template: "%s · FreshNear" },
  description:
    "FreshNear—shop daily essentials from the nearest branch. Real-time stock, promos & vouchers, dynamic shipping, secure payment, and order tracking.",
  icons: {
    icon: [{ url: "/mainLogo/FreshNearLogoSmall.png", type: "image/png" }],
    shortcut: [{ url: "/mainLogo/FreshNearLogoSmall.png" }],
    apple: [{ url: "/mainLogo/FreshNearLogoSmall.png" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "FreshNear",
    title: "FreshNear",
    description:
      "FreshNear makes grocery shopping easy with automatic nearest-store detection.",
    images: [
      {
        url: "/mainLogo/FreshNearLogoSmall.png", // akan jadi absolut karena ada metadataBase
        width: 512,
        height: 512,
        alt: "FreshNear Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshNear",
    description:
      "FreshNear makes grocery shopping easy with automatic nearest-store detection.",
    images: ["/mainLogo/FreshNearLogoSmall.png"],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable}`}
      >
        <ReactQueryProvider>
          <LayoutWrapper>
            <LocationManager />
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
          </LayoutWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
