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

export default function HomePage() {
  const { targetStore } = useUserAuthStore();
  const { data: targetStoreProducts } = useGetAllTargetStoreProducts(
    targetStore?.id || "8d3b7b05-d17d-4dd5-a463-499a1e190d5e", // default store when there is no targetStore.id (which is Jakarta main store)
  );

  // map BE shape → what ProductCard already expects
  const cardList = targetStoreProducts?.map((p) => ({
    id: p.id,
    image: p.picture1,
    name: p.name,
    category: p.category.name,
    price: p.price,
    stock: p.stock, // <-- pass stock
    slug: p.slug,
    discount:
      p.discount?.valueType === "PERCENTAGE"
        ? p.discount.value / 100
        : undefined,
  }));

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
      <ProductList items={cardList || []} name="Recommended Product" />
      <ProductList items={cardList || []} name="Latest Product" />
      <CustomBorder />
      <BenefitBanner />
    </div>
  );
}
