import { cn } from "@/lib/utils";

type IndicatorsProps = {
  count: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function CarouselIndicators({
  count,
  selectedIndex,
  onSelect,
}: IndicatorsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            "h-3 w-3 rounded-full transition-colors",
            index === selectedIndex ? "bg-green-700" : "bg-black",
          )}
        />
      ))}
    </>
  );
}
