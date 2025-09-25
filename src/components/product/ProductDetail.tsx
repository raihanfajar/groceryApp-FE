"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useProductBySlug } from "@/hooks/product/useProducts";
import { Product } from "@/types/product/productTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currency";
import {
  ShoppingCart,
  Heart,
  Share2,
  MapPin,
  Plus,
  Minus,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const router = useRouter();
  const { data, isLoading, error } = useProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  // Set default store if not already selected - must be called before conditional returns
  useEffect(() => {
    if (
      data?.data?.product?.storeStock &&
      data.data.product.storeStock.length > 0 &&
      !selectedStoreId
    ) {
      setSelectedStoreId(data.data.product.storeStock[0].store.id);
    }
  }, [data?.data?.product?.storeStock, selectedStoreId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-96 rounded-lg bg-gray-300"></div>
            <div className="space-y-4">
              <div className="h-8 rounded bg-gray-300"></div>
              <div className="h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="h-6 w-1/2 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data?.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const product: Product = data.data.product;

  const selectedStoreStock = product.storeStock?.find(
    (stock) => stock.store.id === selectedStoreId,
  );

  const maxQuantity = selectedStoreStock?.stock || 0;
  const isInStock = maxQuantity > 0;

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", {
      product: product.id,
      quantity,
      store: selectedStoreId,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button onClick={() => router.back()} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.picture1 || "/placeholder-product.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Additional Images */}
          <div className="grid grid-cols-4 gap-2">
            {[product.picture2, product.picture3, product.picture4]
              .filter(Boolean)
              .map((picture, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={picture!}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover transition-opacity hover:opacity-80"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              {product.category && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}
              <Badge variant={isInStock ? "default" : "destructive"}>
                {isInStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="text-primary text-2xl font-bold">
                {formatCurrency(product.price)}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">4.5 (123 reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              {product.description.includes("<") &&
              product.description.includes(">") ? (
                <div
                  className="max-w-none leading-relaxed text-gray-700 [&_br]:mb-2 [&_br]:block [&_em]:italic [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:font-bold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <div className="leading-relaxed whitespace-pre-wrap text-gray-700">
                  {product.description}
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Store Selection */}
          {product.storeStock && product.storeStock.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Available Stores</h3>
              <div className="space-y-2">
                {product.storeStock.map((stock) => (
                  <Card
                    key={stock.store.id}
                    className={`cursor-pointer transition-colors ${
                      selectedStoreId === stock.store.id
                        ? "ring-primary ring-2"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedStoreId(stock.store.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{stock.store.name}</p>
                            <p className="text-sm text-gray-600">
                              {stock.store.city}, {stock.store.province}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {stock.stock} in stock
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-semibold">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(false)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center text-lg font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(true)}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="ml-2 text-sm text-gray-600">
                  {maxQuantity} available
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!isInStock || !selectedStoreId}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {selectedStoreStock && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm text-green-800">
                  <strong>Selected Store:</strong>{" "}
                  {selectedStoreStock.store.name}
                </p>
                <p className="text-sm text-green-700">
                  Ready for pickup or delivery
                </p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span>{product.weight}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span>{product.category?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SKU:</span>
                <span>{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stock:</span>
                <span>{product.totalStock || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
