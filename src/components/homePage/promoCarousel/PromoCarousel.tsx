"use client";

import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CarouselProps } from "../typesAndInterfaces";
import PromoFooter from "./CarouselFooter";
import CarouselIndicators from "./CarouselIndicators";
import CarouselNavButton from "./CarouselNavButton";

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

export default function PromoCarousel({ items }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);
  const [mainHovered, setMainHovered] = useState(false);

  // Fetch active marketing promos from API
  const { data: marketingPromos, isLoading } = useQuery({
    queryKey: ["marketing-promos", "homepage"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/discounts/marketing-promos?activeOnly=true",
      );
      return (response.data as { data: MarketingPromo[] }).data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Combine API promos with static items (fallback)
  const displayItems =
    marketingPromos && marketingPromos.length > 0
      ? marketingPromos.map((promo) => ({
          title: promo.name,
          image: promo.bannerImageUrl || "/promoCarousel/sample-banner-1.jpeg",
          alt: promo.name,
          link: `/promo/${slugify(promo.name)}`,
          description: promo.description || "",
        }))
      : items; // Fallback to static items if no API data

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const stopAutoplay = useCallback(() => {
    if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
      autoplayInterval.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!emblaApi) return;
    stopAutoplay();
    autoplayInterval.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 2500);
  }, [emblaApi, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () =>
      setSelectedIndex(emblaApi.selectedScrollSnap()),
    );
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    startAutoplay();
    return () => stopAutoplay();
  }, [emblaApi, startAutoplay, stopAutoplay]);

  return (
    <div className="w-full py-9">
      <div className="relative mx-auto h-fit max-w-[1000px] overflow-hidden">
        {/* Carousel */}
        {isLoading ? (
          <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100">
            <div className="text-gray-400">Loading promotions...</div>
          </div>
        ) : (
          <div
            className="embla"
            ref={emblaRef}
            onMouseEnter={() => {
              if (emblaApi) stopAutoplay();
              setMainHovered(true);
            }}
            onMouseLeave={() => {
              if (emblaApi) startAutoplay();
              setMainHovered(false);
            }}
          >
            <div className="flex">
              {displayItems.map((item, index) => (
                <div
                  key={index}
                  className="relative h-96 flex-[0_0_100%] overflow-hidden rounded-lg px-2"
                >
                  <Link href={item.link} className="block h-full w-full">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill // makes the image span the whole box
                      // sizes="1000px"
                      priority={index === 0} // optional: faster first paint
                      className="object-cover"
                    />
                  </Link>
                </div>
              ))}
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
                    arial-label="Previous"
                  />
                  <CarouselNavButton
                    direction="right"
                    onClick={scrollNext}
                    arial-label="Next"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Indicators + Footer */}
        <div className="flex items-center justify-center space-x-2 pl-3">
          <CarouselIndicators
            count={displayItems.length}
            selectedIndex={selectedIndex}
            onSelect={(i) => emblaApi?.scrollTo(i)}
          />
          <PromoFooter />
        </div>
      </div>
    </div>
  );
}
