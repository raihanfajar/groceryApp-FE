"use client";
import Link from "next/link";
import { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import CustomBorder from "../CustomBorder";
import { menuSections } from "../mapData";
import * as MdIcons from "react-icons/md";

// interface MenuItem {
//   label: string;
//   href: string;
//   icon: React.ElementType; // because you are passing icons
// }

// interface MenuSection {
//   title: string;
//   items: MenuItem[];
// }

// const menuSections: MenuSection[] = [
//   {
//     title: "My Account",
//     items: [
//       { label: "Transactions (dev)", href: "#", icon: MdOutlineReceiptLong },
//     ],
//   },
//   {
//     title: "Main",
//     items: [
//       { label: "Brand (Bonus)", href: "#", icon: MdOutlineBrandingWatermark },
//       { label: "Promo (dev)", href: "#", icon: MdOutlineDiscount },
//       { label: "All Category (dev)", href: "#", icon: MdOutlineGridView },
//     ],
//   },
//   {
//     title: "Customer Service",
//     items: [
//       { label: "FAQ", href: "/faq", icon: MdOutlineQuestionAnswer },
//       {
//         label: "How to Shop",
//         href: "/faq/how-to-shop",
//         icon: MdOutlineQuestionMark,
//       },
//     ],
//   },
//   {
//     title: "Discover FreshNear",
//     items: [
//       { label: "About FreshNear (dev)", href: "#", icon: MdOutlineInfo },
//       {
//         label: "Terms & Conditions (dev)",
//         href: "#",
//         icon: MdOutlineDocumentScanner,
//       },
//       { label: "Privacy Policy (dev)", href: "#", icon: MdOutlinePrivacyTip },
//       { label: "Career (Bonus)", href: "#", icon: MdOutlinePeople },
//     ],
//   },
//   {
//     title: "Contact Us",
//     items: [
//       {
//         label: "fnsupport@gmail.com",
//         href: "mailto:fnsupport@gmail.com",
//         icon: MdOutlineEmail,
//       },
//       { label: "666-666-666", href: "tel:666-666-666", icon: MdOutlinePhone },
//     ],
//   },
// ];

export default function MenuDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* MENU DRAWER */}
      <div className="fixed top-0 left-0 z-[100] h-screen w-full overflow-y-auto bg-white text-black">
        {/* Header */}
        <nav className="sticky top-0 left-0 flex h-16 items-center justify-between border-b border-gray-300 bg-white px-4 text-sm">
          <h1 className="text-lg font-bold">Menu</h1>
          <MdOutlineClose
            size={27}
            className="cursor-pointer"
            onClick={onClose}
          />
        </nav>

        {/* Content */}
        <div className="space-y-6 px-4 py-4 text-base">
          {/* Buttons Pake Button biasa karena kalo pake button shadcn ada bug, buang" waktu nyari solusi-nya */}
          <div className="flex gap-3 font-bold">
            <button className="w-full cursor-pointer rounded-md bg-green-700 py-2 text-white hover:bg-black">
              Login (dev)
            </button>
            <button className="w-full cursor-pointer rounded-md border border-green-700 py-2 text-black hover:bg-black hover:text-white">
              Register (dev)
            </button>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h2 className="mb-2 text-lg font-bold text-gray-500">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.items.map((item) => {
                    const IconComponent =
                      MdIcons[item.icon as keyof typeof MdIcons];
                    return (
                      <div key={item.label} className="flex items-center gap-2">
                        <IconComponent size={20} />
                        <Link href={item.href} onClick={onClose}>
                          {item.label}
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <CustomBorder />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
