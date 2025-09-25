"use client";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlineGridView, MdShoppingCart } from "react-icons/md";
import "simplebar/dist/simplebar.min.css";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import LogoutDialog from "../LogoutDialog";
import { ProfileDropDown } from "./DropDown";
import MegaMenu from "./MegaMenu";

type cartCountProps = {
  cartCount: number;
};

export default function BotNavDesktop({ cartCount }: cartCountProps) {
  const { name } = useUserAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
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
        <div className="relative">
          <Link
            href="/categories"
            className="flex items-center justify-center gap-1 transition-colors hover:text-green-600"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <MdOutlineGridView size={17} />
            <p className="cursor-pointer">Categories</p>
          </Link>
          {/* MEGAMENU */}
          <MegaMenu
            isOpen={isOpen}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />
        </div>
        <form onSubmit={handleSearch} className="flex w-[40%] items-center">
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!text-md h-[32px] rounded-r-none border border-r-0 border-gray-300 bg-white font-mono text-black focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700"
          >
            <FiSearch className="h-[32px]" />
          </button>
        </form>
        <Link
          href="/products"
          className="transition-colors hover:text-green-600"
        >
          Products
        </Link>
        <h1>Promo (Dev)</h1>
        {name && (
          <Link href={"/cart"} className="relative">
            <MdShoppingCart size={24} />
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartCount}
              </div>
            )}
          </Link>
        )}
        <Separator orientation="vertical" className="max-h-[60%] bg-black" />
        {name ? (
          <>
            <ProfileDropDown />
            <LogoutDialog />
          </>
        ) : (
          <>
            <Link href="/user-login">Login</Link>
            <Link href="/user-register">Register</Link>
          </>
        )}
      </div>
    </>
  );
}
