import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  size?: number;
  className?: string;
  onClick?: () => void;
};

export const Avatar = ({ src, alt, size = 96, className, onClick }: Props) => (
  <div
    onClick={onClick}
    className={cn(
      "relative overflow-hidden rounded-full mx-auto",
      "shadow ring-2 ring-white",
      onClick && "cursor-pointer transition hover:ring-green-400",
      className,
    )}
    style={{ width: size, height: size }}
  >
    <Image
      fill
      sizes={`${size}px`}
      src={src || "/profile.jpg"}
      alt={alt}
      className="object-cover"
      priority
    />
  </div>
);
