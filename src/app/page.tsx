import BenefitBanner from "@/components/HomePage/benefitBanner/BenefitBanner";
import CategoryCarousel from "@/components/HomePage/categoryCarousel/CategoryCarousel";
import CustomBorder from "@/components/HomePage/CustomBorder";
import {
  carouselItems,
  categories,
  dummyRecommendedProducts,
} from "@/components/HomePage/mapData";
import { ProductList } from "@/components/HomePage/productDisplay/ProductList";
import PromoCarousel from "@/components/HomePage/promoCarousel/PromoCarousel";

export default function HomePage() {
  return (
    <div className="mx-auto">
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
      <CustomBorder />
    </div>
  );
}
