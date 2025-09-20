import { CreateCategoryFormData } from "@/types/admin/product";
import { getIconById, getDefaultIcon } from "@/constants/categoryIcons";

interface CategoryCreatePreviewProps {
  formData: CreateCategoryFormData;
}

export default function CategoryCreatePreview({
  formData,
}: CategoryCreatePreviewProps) {
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const selectedIcon = formData.icon
    ? getIconById(formData.icon) || getDefaultIcon()
    : getDefaultIcon();

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-700">Preview</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className={`rounded-lg bg-white p-2 ${selectedIcon.color}`}>
            <selectedIcon.icon size={20} />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Name: </span>
            <span className="text-sm text-gray-900">
              {formData.name || "Category name will appear here"}
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Slug: </span>
          <span className="font-mono text-sm text-gray-700">
            {formData.name ? generateSlug(formData.name) : "category-slug"}
          </span>
        </div>
        {formData.description && (
          <div>
            <span className="text-sm font-medium text-gray-600">
              Description:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {formData.description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
