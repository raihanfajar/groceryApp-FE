"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlineMenu, MdShoppingCart } from "react-icons/md";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import MenuDrawer from "./MenuDrawer";

type cartCountProps = {
  cartCount: number;
  onClick: () => void;
};

export default function TopNavMobile({ cartCount, onClick }: cartCountProps) {
  const { name } = useUserAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-black bg-green-100 px-4 text-sm">
        <Link href={"/"}>
          <Image
            src="/mainLogo/FreshNearLogoSmall.png"
            alt="mainLogo"
            width={25}
            height={10}
          />
        </Link>
        <div className="flex w-[65%] items-center">
          <Input
            type="search"
            placeholder="Search for products..."
            className="h-[35px] rounded-r-none border border-r-0 border-gray-300 bg-white font-mono !text-xs text-black focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button className="flex items-center justify-center rounded-r-md bg-green-600 px-3 text-white hover:bg-green-700">
            <FiSearch className="h-[35px]" />
          </button>
        </div>
        {name && (
          <Link href={"/cart"} className="relative">
            <MdShoppingCart size={20} className="cursor-pointer" />
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartCount}
              </div>
            )}
          </Link>
        )}
        <MdOutlineMenu
          size={27}
          className="cursor-pointer"
          onClick={() => setIsMenuOpen(true)}
        />
      </div>

      {/* MENU DRAWER */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onClick={onClick} />
    </>
  );
}
