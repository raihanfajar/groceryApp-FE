"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlineGridView, MdShoppingCart } from "react-icons/md";
import "simplebar-react/dist/simplebar.min.css";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import MegaMenu from "./MegaMenu";
import { useUserAuthStore } from "@/store/useUserAuthStore";

export default function BotNavDesktop() {
  const { name, clearAuth } = useUserAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250); // Slight delay for better UX
  };

  return (
    <>
      {/* MAIN NAV */}
      <div className="flex h-16 items-center justify-between border-b border-black bg-green-100 px-24">
        <Link href={"/"}>
          <Image
            src="/mainLogo/FreshNearLogoFull.png"
            alt="mainLogo"
            width={110}
            height={50}
          />
        </Link>
        <span
          className="flex items-center justify-center gap-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MdOutlineGridView size={17} />
          <p className="cursor-pointer">Category</p>
        </span>
        <div className="flex w-[40%] items-center">
          <Input
            type="search"
            placeholder="Search for products..."
            className="!text-md h-[32px] rounded-r-none border border-r-0 border-gray-300 bg-white font-mono text-black focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button className="flex items-center justify-center rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700">
            <FiSearch className="h-[32px]" />
          </button>
        </div>
        <h1>Brand (Bonus)</h1>
        <h1>Promo (Dev)</h1>
        {name && (
          <Link href={"/cart"}>
            <MdShoppingCart size={24} />
          </Link>
        )}
        <Separator orientation="vertical" className="max-h-[60%] bg-black" />
        {name ? (
          <>
            <Link href="/" onClick={() => clearAuth()}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link href="/user-login">Login (Dev)</Link>
            <Link href="/user-register">Register (Dev)</Link>
          </>
        )}
      </div>

      {/* MEGAMENU */}
      <MegaMenu
        isOpen={isOpen}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </>
  );
}
