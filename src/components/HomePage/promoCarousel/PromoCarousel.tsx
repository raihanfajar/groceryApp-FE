"use client";

import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CarouselProps } from "../typesAndInterfaces";
import PromoFooter from "./CarouselFooter";
import CarouselIndicators from "./CarouselIndicators";
import CarouselNavButton from "./CarouselNavButton";

export default function PromoCarousel({ items }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);
  const [mainHovered, setMainHovered] = useState(false);

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
            {items.map((item, index) => (
              <div key={index} className="flex-[0_0_100%] px-2">
                <Link href={item.link}>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={1000}
                    height={1000}
                    className="w-full rounded-lg object-cover"
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

        {/* Indicators + Footer */}
        <div className="flex items-center justify-center space-x-2 pl-3">
          <CarouselIndicators
            count={items.length}
            selectedIndex={selectedIndex}
            onSelect={(i) => emblaApi?.scrollTo(i)}
          />
          <PromoFooter />
        </div>
      </div>
    </div>
  );
}
