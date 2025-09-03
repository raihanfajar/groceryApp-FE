"use client";
import { cn } from "@/lib/utils"; // if you have utils, else just use string interpolation
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "About FreshNear", href: "/about" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <div className="w-full rounded-lg border bg-white p-4 text-sm shadow-sm">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block rounded-md p-2 hover:bg-gray-100",
                pathname === item.href ? "bg-gray-200 font-semibold" : "",
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
