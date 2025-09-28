import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavButtonProps } from "../typesAndInterfaces";

// interface CarouselNavButtonProps extends NavButtonProps {
//   size?: "sm" | "md" | "lg"; // props-nya
// }

export default function CarouselNavButton({
  direction,
  onClick,
  size = "md", // defalt kalo parent nggak pass prop-nya
}: NavButtonProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", // defalt
    lg: "w-12 h-12",
  };

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full !bg-[#008236] p-0 !text-white shadow-md",
        sizeClasses[size],
        direction === "left" ? "left-4" : "right-4",
      )}
    >
      {direction === "left" ? (
        <ChevronLeft className={iconSize[size]} />
      ) : (
        <ChevronRight className={iconSize[size]} />
      )}
    </Button>
  );
}
