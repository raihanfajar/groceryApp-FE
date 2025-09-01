"use client";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";
import CarouselNavButton from "../promoCarousel/CarouselNavButton";
import { CategoryProps } from "../typesAndInterfaces";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CategoryCarousel({ items }: CategoryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [mainHovered, setMainHovered] = useState(false);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="w-full md:block py-6 bg-green-100">
      <div
        className="relative mx-auto max-w-[1000px] overflow-hidden"
        onMouseEnter={() => setMainHovered(true)}
        onMouseLeave={() => setMainHovered(false)}
      >
        {/* Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="flex h-fit items-center">
            {items.map((item, index) => {
              const IconComponent = FaIcons[item.icon as keyof typeof FaIcons];
              return (
                <div
                  key={index}
                  className="flex-[0_0_20%] px-2 md:flex-[0_0_10%] lg:flex-[0_0_8%]"
                >
                  <Link
                    href={"#"}
                    className="flex w-full items-center justify-center"
                  >
                    <Button variant={"outline"}>
                      <IconComponent color="green" />
                      <p>{item.name}</p>
                    </Button>
                  </Link>
                </div>
              );
            })}
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
