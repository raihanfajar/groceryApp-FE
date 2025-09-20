import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CATEGORY_ICONS,
  getIconById,
  getDefaultIcon,
} from "@/constants/categoryIcons";
import { Check, ChevronDown } from "lucide-react";

interface CategoryIconSelectorProps {
  selectedIconId?: string;
  onIconSelect: (iconId: string) => void;
  label?: string;
  required?: boolean;
}

export default function CategoryIconSelector({
  selectedIconId,
  onIconSelect,
  label = "Category Icon",
  required = false,
}: CategoryIconSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedIcon = selectedIconId
    ? getIconById(selectedIconId) || getDefaultIcon()
    : getDefaultIcon();

  const handleIconSelect = (iconId: string) => {
    onIconSelect(iconId);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="icon-selector">
        {label} {required && "*"}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="icon-selector"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto w-full justify-between py-3"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`rounded-lg bg-gray-100 p-2 ${selectedIcon.color}`}
              >
                <selectedIcon.icon size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium">{selectedIcon.name}</div>
                <div className="text-sm text-gray-500">
                  {selectedIcon.description}
                </div>
              </div>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-80 overflow-y-auto">
            <div className="grid grid-cols-1 gap-1 p-2">
              {CATEGORY_ICONS.map((icon) => {
                const isSelected = selectedIconId === icon.id;
                return (
                  <Button
                    key={icon.id}
                    variant="ghost"
                    onClick={() => handleIconSelect(icon.id)}
                    className="h-auto w-full justify-start px-3 py-3 hover:bg-gray-50"
                  >
                    <div className="flex w-full items-center space-x-3">
                      <div
                        className={`rounded-lg bg-gray-100 p-2 ${icon.color}`}
                      >
                        <icon.icon size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{icon.name}</div>
                        <div className="text-sm text-gray-500">
                          {icon.description}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <p className="text-sm text-gray-500">
        Select an icon that best represents this category
      </p>
    </div>
  );
}
