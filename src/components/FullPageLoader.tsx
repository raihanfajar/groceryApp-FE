// src/components/FullPageLoader.tsx
"use client";
import groceryBg from "@/../public/groceryBackgroundImage.jpeg";
import logo from "@/../public/mainLogo/FreshNearLogoFull.png";
import Image from "next/image";
import { useEffect } from "react";

interface Props {
  show: boolean; // controlled from parent
  onFadeDone: () => void;
}

export default function FullPageLoader({ show, onFadeDone }: Props) {
  useEffect(() => {
    if (!show) {
      const t = setTimeout(onFadeDone, 500); // wait for CSS fade
      return () => clearTimeout(t);
    }
  }, [show, onFadeDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-items-center transition-opacity duration-500 ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        backgroundImage: `url(${groceryBg.src})`,
        backgroundSize: "25%",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <Image
        src={logo}
        alt="FreshNear"
        priority
        className="relative h-28 sm:h-32 w-auto"
        style={{ animation: "breathe 2.5s ease-in-out infinite" }}
      />
      <style jsx>{`
        @keyframes breathe {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
