import { getIconById, getDefaultIcon } from "@/constants/categoryIcons";

interface CategoryIconProps {
  iconId?: string;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export default function CategoryIcon({
  iconId,
  size = 16,
  className = "",
  showBackground = false,
}: CategoryIconProps) {
  const iconData = iconId
    ? getIconById(iconId) || getDefaultIcon()
    : getDefaultIcon();
  const IconComponent = iconData.icon;

  if (showBackground) {
    return (
      <div
        className={`rounded-md bg-gray-100 p-1.5 ${iconData.color} ${className}`}
      >
        <IconComponent size={size} />
      </div>
    );
  }

  return (
    <IconComponent size={size} className={`${iconData.color} ${className}`} />
  );
}
