"use client";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import CarouselNavButton from "../promoCarousel/CarouselNavButton";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCategories } from "@/hooks/product/useProducts";
import { getCategorySlug } from "@/utils/slug";
import CategoryIcon from "@/components/ui/CategoryIcon";

export default function CategoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [mainHovered, setMainHovered] = useState(false);

  // Fetch real category data from API
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const categories = categoriesData?.data?.categories || [];

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (categoriesLoading) {
    return (
      <div className="w-full bg-green-100 py-6 md:block">
        <div className="relative mx-auto max-w-[1000px] overflow-hidden">
          <div className="flex h-fit items-center">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="flex-[0_0_20%] px-2 md:flex-[0_0_10%] lg:flex-[0_0_8%]"
              >
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-green-100 py-6 md:block">
      <div
        className="relative mx-auto max-w-[1000px] overflow-hidden"
        onMouseEnter={() => setMainHovered(true)}
        onMouseLeave={() => setMainHovered(false)}
      >
        {/* Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="flex h-fit items-center">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-[0_0_20%] px-2 md:flex-[0_0_10%] lg:flex-[0_0_8%]"
              >
                <Link
                  href={`/products?category=${category.slug || getCategorySlug(category.name)}`}
                  className="flex w-full items-center justify-center"
                >
                  <Button
                    variant={"outline"}
                    className="flex items-center gap-2"
                  >
                    <CategoryIcon
                      iconId={category.icon}
                      size={16}
                      showBackground={false}
                    />
                    <p>{category.name}</p>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <AnimatePresence>
          {mainHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CarouselNavButton
                direction="left"
                onClick={scrollPrev}
                aria-label="Previous"
                size="sm"
              />
              <CarouselNavButton
                direction="right"
                onClick={scrollNext}
                aria-label="Next"
                size="sm"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
