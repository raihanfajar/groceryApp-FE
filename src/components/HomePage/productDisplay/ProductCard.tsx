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
}: ProductCardProps) {
  const displayedPrice = discount ? price * (1 - discount) : price;

  return (
    <Card className="flex w-[180px] flex-col justify-between gap-3 rounded-xl px-0 py-1.5 shadow-md transition hover:shadow-lg">
      <div className="relative flex h-40 w-full items-center justify-center bg-white">
        <Image
          src={image}
          alt={name}
          width={120}
          height={120}
          className="object-contain"
        />
        {discount && (
          <Badge className="absolute top-0 right-2 bg-red-600 text-xs text-white">
            {discount * 100}%
          </Badge>
        )}
      </div>

      <CardContent className="flex h-[40%] flex-col gap-0.5 px-3 py-0">
        <Badge variant="secondary" className="w-fit bg-green-100 text-xs">
          {category}
        </Badge>
        <p className="line-clamp-2 text-sm">{name}</p>
        <p className="mt-auto font-bold text-red-600">
          Rp {displayedPrice.toLocaleString()}
          {discount && (
            <span className="ml-2 text-xs text-gray-600 line-through">
              Rp {price.toLocaleString()}
            </span>
          )}
        </p>
        <div className="flex h-5 items-center gap-1 text-xs text-gray-600">
          <Truck size={14} className="text-orange-500" />
          Instant Delivery
        </div>
      </CardContent>

      <CardFooter className="p-3">
        <Button variant="default" className="w-full bg-green-700 cursor-pointer">
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
}
