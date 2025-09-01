import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CarouselFooter() {
  return (
    <div className="ml-auto flex pr-2">
      <Button
        variant="link"
        className="!rounded-br-none !rounded-bl-none text-gray-600"
      >
        <Link href={"#"}>See All Promo</Link>
      </Button>
    </div>
  );
}
