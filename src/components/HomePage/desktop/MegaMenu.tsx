import { Separator } from "@/components/ui/separator";
import * as FaIcons from "react-icons/fa";
import SimpleBar from "simplebar-react";
import { categories } from "../mapData";
import { MegaMenuProps } from "../typesAndInterfaces";

export default function MegaMenu({
  isOpen,
  handleMouseEnter,
  handleMouseLeave,
  activeCategory,
  setActiveCategory,
}: MegaMenuProps) {
  if (!isOpen) return null; // Cleaner than wrapping everything in `{isOpen && ...}`

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute top-24 flex h-[calc(100vh-200px)] w-full flex-col gap-2 overflow-auto border-b border-black bg-white px-4 shadow-lg md:px-16 lg:px-32 xl:px-52"
    >
      <h1 className="mt-0.5 text-lg">Category</h1>
      <Separator
        orientation="horizontal"
        className="absolute top-9 left-0 w-screen bg-black"
      />

      <div className="flex h-full w-full flex-wrap px-4 py-6">
        {/* Main Categories */}
        <SimpleBar
          style={{ maxHeight: "calc(100vh - 295px)" }}
          className="w-full border-r border-gray-300 pr-2 text-xs md:w-1/3 lg:text-base"
        >
          <ul>
            {categories.map((category, index) => {
              const IconComponent =
                FaIcons[category.icon as keyof typeof FaIcons];
              return (
                <li
                  key={index}
                  className={`flex cursor-pointer items-center gap-1 px-4 py-2 hover:bg-green-100 ${
                    activeCategory === category.name
                      ? "bg-green-200 font-semibold"
                      : ""
                  }`}
                  onMouseEnter={() => setActiveCategory(category.name)}
                >
                  <IconComponent />
                  {category.name}
                </li>
              );
            })}
          </ul>
        </SimpleBar>

        {/* Subcategories */}
        <SimpleBar
          style={{ maxHeight: "calc(100vh - 295px)" }}
          className="w-full text-xs md:w-1/3"
        >
          <ul className="w-full px-6 text-xs md:text-xs lg:text-sm">
            {categories
              .find((category) => category.name === activeCategory)
              ?.subcategories.map((sub, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer px-4 py-2 hover:bg-green-50"
                >
                  {sub}
                </li>
              ))}
          </ul>
        </SimpleBar>
      </div>
    </div>
  );
}
