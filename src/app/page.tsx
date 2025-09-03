import BenefitBanner from "@/components/homePage/benefitBanner/BenefitBanner";
import CategoryCarousel from "@/components/homePage/categoryCarousel/CategoryCarousel";
import CustomBorder from "@/components/homePage/CustomBorder";
import {
  carouselItems,
  categories,
  dummyRecommendedProducts,
} from "@/components/homePage/mapData";
import { ProductList } from "@/components/homePage/productDisplay/ProductList";
import PromoCarousel from "@/components/homePage/promoCarousel/PromoCarousel";

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
