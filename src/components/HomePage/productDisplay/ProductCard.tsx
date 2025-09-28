"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Truck } from "lucide-react";
import Image from "next/image";
import { ProductCardProps } from "../typesAndInterfaces";

export function ProductCard({
  image,
  name,
  category,
  price,
  discount,
  stock = 0,
}: ProductCardProps & { stock?: number }) {
  const isOut = stock === 0;
  const displayedPrice = discount ? Math.round(price * (1 - discount)) : price;

  return (
    <Card
      className={`group relative flex flex-col justify-between gap-3 rounded-xl p-2 shadow-md transition hover:shadow-lg md:w-[180px] ${isOut ? "opacity-60 saturate-50" : ""} `}
    >
      {/* OUT-OF-STOCK overlay */}
      {isOut && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        </div>
      )}

      {/* image */}
      <div className="relative flex h-40 w-full items-center justify-center rounded-md bg-white">
        <Image
          src={image || "/img-placeholder.svg"}
          alt={name}
          width={120}
          height={120}
          className="object-contain"
        />
        {discount && discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-600 text-[10px] text-white">
            -{Math.round(discount * 100)}%
          </Badge>
        )}
      </div>

      {/* meta */}
      <CardContent className="flex h-[40%] flex-col gap-1 px-2 pb-0">
        <Badge variant="secondary" className="w-fit bg-green-100 text-[10px]">
          {category}
        </Badge>
        <p className="line-clamp-2 text-xs md:text-sm">{name}</p>
        <p className="mt-auto font-bold text-red-600">
          Rp {displayedPrice.toLocaleString("id-ID")}
          {discount && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              Rp {price.toLocaleString("id-ID")}
            </span>
          )}
        </p>
        <div className="flex h-5 items-center gap-1 text-[10px] text-gray-600">
          <Truck size={14} className="text-orange-500" />
          Instant delivery
        </div>
      </CardContent>

      {/* button */}
      <CardFooter className="p-2">
        <Button
          disabled={isOut}
          variant={isOut ? "secondary" : "default"}
          className={`w-full ${
            isOut
              ? "cursor-not-allowed"
              : "cursor-pointer bg-green-700 hover:bg-green-600"
          }`}
        >
          {isOut ? "Unavailable" : "Buy"}
        </Button>
      </CardFooter>
    </Card>
  );
}
