"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductCard } from "./ProductCard"; // child component yang dibuat
import { ProductProps } from "../typesAndInterfaces";

export function ProductList({ items, name }: ProductProps) {
  const [visibleCount, setVisibleCount] = useState(12); // initial products shown
  const visibleProducts = items.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6); // show 5 more each click
  };

  return (
    <div className="scaledown mx-auto flex max-w-[1280px] flex-col justify-center py-8">
      <h2 className="mb-4 self-start text-xl font-semibold">{name}</h2>
      <div className="flex flex-col rounded-lg bg-[#d8d8d845] p-2.5 md:p-8 md:pb-2">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              category={product.category}
              price={product.price}
              discount={product.discount}
            />
          ))}
        </div>
        {visibleCount < items.length && (
          <Button
            variant="link"
            onClick={handleShowMore}
            className="mx-auto mt-2 cursor-pointer text-blue-600 hover:underline"
          >
            Show more...
          </Button>
        )}
      </div>
    </div>
  );
}
