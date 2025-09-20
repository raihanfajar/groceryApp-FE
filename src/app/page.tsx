import BenefitBanner from "@/components/homePage/benefitBanner/BenefitBanner";
import CategoryCarousel from "@/components/homePage/categoryCarousel/CategoryCarousel";
import { ProductList } from "@/components/homePage/productDisplay/ProductList";
import PromoCarousel from "@/components/homePage/promoCarousel/PromoCarousel";

// Import data dengan path yang sudah dikoreksi
import {
  carouselItems,
  dummyRecommendedProducts,
} from "@/components/homePage/mapData";
import CustomBorder from "@/components/HomePage/CustomBorder";

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen">
      <PromoCarousel items={carouselItems} />
      <CustomBorder />
      <CategoryCarousel />
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
