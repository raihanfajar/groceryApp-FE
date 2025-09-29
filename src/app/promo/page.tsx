// src/app/promo/page.tsx
import Image from "next/image";
import Link from "next/link";
import { carouselItems } from "@/components/homePage/mapData";

export default function PromoPage() {
  return (
    <main className="scaledown mx-auto max-w-7xl px-4 py-5">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
        All Promotions
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {carouselItems.map((p) => (
          <Link
            key={p.title}
            href={p.link} // will become /promo/slug later
            className="group block overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl"
          >
            <div className="relative h-[11.8rem] w-full">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
                {p.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Click to see details →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
