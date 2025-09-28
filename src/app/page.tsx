"use client";
import BenefitBanner from "@/components/HomePage/benefitBanner/BenefitBanner";
import CategoryCarousel from "@/components/HomePage/categoryCarousel/CategoryCarousel";
import { ProductList } from "@/components/HomePage/productDisplay/ProductList";
import PromoCarousel from "@/components/HomePage/promoCarousel/PromoCarousel";

// Import data dengan path yang sudah dikoreksi
import CustomBorder from "@/components/HomePage/CustomBorder";
import { carouselItems } from "@/components/HomePage/mapData";
import { useGetAllTargetStoreProducts } from "@/hooks/home/useGetAllTargetStoreProducts";
import { useUserAuthStore } from "@/store/useUserAuthStore";

export default function HomePage() {
  const { targetStore } = useUserAuthStore();
  const { data: targetStoreProducts } = useGetAllTargetStoreProducts(
    targetStore?.id,
  );

  // map BE shape → what ProductCard already expects
  const cardList = targetStoreProducts?.map((p) => ({
    id: p.id,
    image: p.picture1,
    name: p.name,
    category: p.category.name,
    price: p.price,
    stock: p.stock, // <-- pass stock
    discount:
      p.discount?.valueType === "PERCENTAGE"
        ? p.discount.value / 100
        : undefined,
  }));

  return (
    <div className="mx-auto min-h-screen bg-white">
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

      <PromoCarousel items={carouselItems} />
      <CustomBorder />
      <CategoryCarousel />
      <CustomBorder />
      <ProductList items={cardList || []} name="Recommended Product" />
      <ProductList items={cardList || []} name="Latest Product" />
      <CustomBorder />
      <BenefitBanner />
    </div>
  );
}
