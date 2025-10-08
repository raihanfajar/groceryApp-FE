"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { carouselItems } from "@/components/homePage/mapData";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { use } from "react";

type Props = { params: Promise<{ slug: string }> };

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

function getStaticPromo(slug: string) {
  return carouselItems.find((p) => slugify(p.title) === slug);
}

export default function PromoDetailPage({ params }: Props) {
  const { slug } = use(params);

  const { data: marketingPromos, isLoading } = useQuery({
    queryKey: ["marketing-promos", "all"],
    queryFn: async () => {
      const response = await axiosInstance.get("/discounts/marketing-promos");
      return (response.data as { data: MarketingPromo[] }).data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Try to find promo from API first, then fallback to static data
  const apiPromo = marketingPromos?.find((p) => slugify(p.name) === slug);
  const staticPromo = getStaticPromo(slug);

  if (isLoading) {
    return (
      <main className="scaledown80 mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading promotion details...</div>
        </div>
      </main>
    );
  }

  // If promo exists in API, use that data
  if (apiPromo) {
    const startDate = new Date(apiPromo.startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const endDate = new Date(apiPromo.endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <main className="scaledown80 mx-auto max-w-4xl px-4 py-8">
        {/* hero */}
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl md:h-80">
          <Image
            src={
              apiPromo.bannerImageUrl || "/promoCarousel/sample-banner-1.jpeg"
            }
            alt={apiPromo.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* meta */}
        <h1 className="text-3xl font-bold text-gray-900">{apiPromo.name}</h1>
        <p className="mt-3 text-gray-600">
          {apiPromo.description || "Check out this amazing promotion!"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Period: {startDate} - {endDate}
        </p>

        {/* status badge */}
        <div className="mt-4">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
              apiPromo.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {apiPromo.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* back button */}
        <Link
          href="/promo"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          ← Back to all promos
        </Link>
      </main>
    );
  }

  // Fallback to static promo data
  if (staticPromo) {
    return (
      <main className="scaledown80 mx-auto max-w-4xl px-4 py-8">
        {/* hero */}
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl md:h-80">
          <Image
            src={staticPromo.image}
            alt={staticPromo.alt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* meta */}
        <h1 className="text-3xl font-bold text-gray-900">
          {staticPromo.title}
        </h1>
        <p className="mt-3 text-gray-600">{staticPromo.description}</p>
        <p className="mt-1 text-sm text-gray-500">
          Period: {staticPromo.period}
        </p>

        {/* bullets */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Terms & Details
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
            {staticPromo.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>

        {/* back button */}
        <Link
          href="/promo"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          ← Back to all promos
        </Link>
      </main>
    );
  }

  // If not found in API or static data
  notFound();
}
