"use client";

import { use } from "react";
import ProductDetail from "@/components/product/ProductDetail";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);

  return (
    <div className="bg-background min-h-screen">
      <ProductDetail slug={slug} />
    </div>
  );
}
