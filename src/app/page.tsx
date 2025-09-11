import BenefitBanner from "@/components/HomePage/benefitBanner/BenefitBanner";
import CategoryCarousel from "@/components/HomePage/categoryCarousel/CategoryCarousel";
import { ProductList } from "@/components/HomePage/productDisplay/ProductList";
import PromoCarousel from "@/components/HomePage/promoCarousel/PromoCarousel";

// Import data dengan path yang sudah dikoreksi
import {
  carouselItems,
  categories,
  dummyRecommendedProducts,
} from "@/components/HomePage/mapData";
import CustomBorder from "@/components/homePage/CustomBorder";

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen">
      <PromoCarousel items={carouselItems} />
      <CustomBorder />
      <CategoryCarousel items={categories} />
      <CustomBorder />
      <ProductList
        items={dummyRecommendedProducts}
        name="Recommended Product"
      />
      <ProductList items={dummyRecommendedProducts} name="Latest Product" />
      <CustomBorder />
      <BenefitBanner />
    </div>
  );
}
