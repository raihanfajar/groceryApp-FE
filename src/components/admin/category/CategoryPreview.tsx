import { UpdateCategoryFormData } from "@/types/admin/product";
import { getIconById, getDefaultIcon } from "@/constants/categoryIcons";

interface CategoryPreviewProps {
  formData: UpdateCategoryFormData;
}

export default function CategoryPreview({ formData }: CategoryPreviewProps) {
  const selectedIcon = formData.icon
    ? getIconById(formData.icon) || getDefaultIcon()
    : getDefaultIcon();

  return (
    <div className="rounded-lg bg-blue-50 p-4">
      <h4 className="mb-2 text-sm font-medium text-blue-700">
        Preview Changes
      </h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className={`rounded-lg bg-white p-2 ${selectedIcon.color}`}>
            <selectedIcon.icon size={20} />
          </div>
          <div>
            <span className="text-sm font-medium text-blue-600">Name: </span>
            <span className="text-sm text-blue-900">
              {formData.name || "Category name will appear here"}
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-blue-600">Slug: </span>
          <span className="font-mono text-sm text-blue-700">
            {formData.name
              ? formData.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "")
              : "category-slug"}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-blue-600">Status: </span>
          <span
            className={`text-sm ${formData.isActive ? "text-green-700" : "text-red-700"}`}
          >
            {formData.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        {formData.description && (
          <div>
            <span className="text-sm font-medium text-blue-600">
              Description:{" "}
            </span>
            <span className="text-sm text-blue-900">
              {formData.description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
