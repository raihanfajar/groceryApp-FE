"use client";
import BenefitBanner from "@/components/homePage/benefitBanner/BenefitBanner";
import CategoryCarousel from "@/components/homePage/categoryCarousel/CategoryCarousel";
import { ProductList } from "@/components/homePage/productDisplay/ProductList";
import PromoCarousel from "@/components/homePage/promoCarousel/PromoCarousel";

// Import data dengan path yang sudah dikoreksi

import CustomBorder from "@/components/homePage/CustomBorder";
import { carouselItems } from "@/components/homePage/mapData";
import { useGetAllTargetStoreProducts } from "@/hooks/home/useGetAllTargetStoreProducts";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import Image from "next/image";

export default function HomePage() {
  const { targetStore } = useUserAuthStore();
  const { data: targetStoreProducts } = useGetAllTargetStoreProducts(
    targetStore?.id || "c2c71ef0-0f43-4b58-b222-22d465bb88c2", // default store when there is no targetStore.id (which is Jakarta main store)
  );

  // map BE shape → what ProductCard already expects
  const cardList = targetStoreProducts?.map((p) => ({
    id: p.id,
    image: p.picture1,
    name: p.name,
    category: p.category.name,
    price: p.price,
    stock: p.stock,
    slug: p.slug,
    discount:
      p.discount?.valueType === "PERCENTAGE"
        ? p.discount.value / 100
        : undefined,
  }));

  console.log(cardList);

  return (
    <div className="mx-auto min-h-screen bg-white">
      <PromoCarousel items={carouselItems} />
      <CustomBorder />
      <CategoryCarousel />
      <CustomBorder />
      {/* optional store title */}
      {targetStore && (
        <div className="mx-auto max-w-[1280px] px-4 pt-4">
          <h1 className="text-xl font-bold text-gray-800">
            {targetStore.name}
          </h1>
          <p className="text-sm text-gray-500">
            All products available at your selected store
          </p>
        </div>
      )}
      {!cardList ? (
        <section className="mx-auto flex h-[calc(100vh-105px)] max-w-[1280px] flex-col items-center justify-center px-4 py-8">
          <Image
            src="/no-product-found.jpeg"
            alt="No Product Found"
            width={400}
            height={400}
          />
          <h2>No Product Found</h2>
        </section>
      ) : (
        <>
          <ProductList items={cardList || []} name="Recommended Product" />
          <ProductList items={cardList || []} name="Latest Product" />
        </>
      )}
      <CustomBorder />
      <BenefitBanner />
    </div>
  );
}
