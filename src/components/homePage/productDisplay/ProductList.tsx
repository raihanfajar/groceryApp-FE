"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductProps } from "../typesAndInterfaces";

export function ProductList({ items, name }: ProductProps) {
  const [visibleCount, setVisibleCount] = useState(12);
  const visible = items.slice(0, visibleCount);

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">{name}</h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {visible.map((p) => (
            <ProductCard key={p.id} {...p} stock={p.stock} slug={p.slug} />
          ))}
        </div>

        {visibleCount < items.length && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((v) => v + 6)}
              className="rounded-full px-6"
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
