"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { carouselItems } from "@/components/homePage/mapData";

interface MarketingPromo {
  id: string;
  name: string;
  description: string | null;
  bannerImageUrl: string | null;
  displayOrder: number | null;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function PromoPage() {
  const { data: marketingPromos, isLoading } = useQuery({
    queryKey: ["marketing-promos", "all"],
    queryFn: async () => {
      const response = await axiosInstance.get("/discounts/marketing-promos");
      return (response.data as { data: MarketingPromo[] }).data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Combine API promos with static items for fallback
  const displayPromos =
    marketingPromos && marketingPromos.length > 0
      ? marketingPromos.map((promo) => ({
          title: promo.name,
          image: promo.bannerImageUrl || "/promoCarousel/sample-banner-1.jpeg",
          alt: promo.name,
          link: `/promo/${slugify(promo.name)}`,
          description: promo.description || "",
        }))
      : carouselItems.map((item) => ({
          title: item.title,
          image: item.image,
          alt: item.alt,
          link: item.link,
          description: item.description,
        }));

  if (isLoading) {
    return (
      <main className="scaledown mx-auto max-w-7xl px-4 py-5">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
          All Promotions
        </h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading promotions...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="scaledown mx-auto max-w-7xl px-4 py-5">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
        All Promotions
      </h1>

      {displayPromos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">
            No promotions available at the moment.
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayPromos.map((p) => (
            <Link
              key={p.title}
              href={p.link}
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
      )}
    </main>
  );
}
