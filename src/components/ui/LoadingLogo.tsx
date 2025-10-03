import Image from "next/image";

interface LoadingLogoProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export default function LoadingLogo({
  size = "md",
  message = "Loading...",
}: LoadingLogoProps) {
  const sizeClasses = {
    sm: { container: "h-16 w-16", text: "text-xs" },
    md: { container: "h-24 w-24", text: "text-sm" },
    lg: { container: "h-32 w-32", text: "text-base" },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div
        className={`${currentSize.container} relative animate-bounce`}
        style={{
          animationDuration: "1s",
          animationTimingFunction: "ease-in-out",
        }}
      >
        <Image
          src="/mainLogo/FreshNearLogoSmall.png"
          alt="Loading"
          fill
          className="animate-pulse object-contain"
          priority
        />
      </div>
      {message && (
        <p className={`${currentSize.text} font-medium text-gray-600`}>
          {message}
        </p>
      )}
    </div>
  );
}
