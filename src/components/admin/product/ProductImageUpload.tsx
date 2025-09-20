import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface ProductImageUploadProps {
  imagePreviews: {
    picture1?: string;
    picture2?: string;
    picture3?: string;
    picture4?: string;
  };
  onImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: "picture1" | "picture2" | "picture3" | "picture4",
  ) => void;
  onRemoveImage: (
    imageKey: "picture1" | "picture2" | "picture3" | "picture4",
  ) => void;
}

export default function ProductImageUpload({
  imagePreviews,
  onImageChange,
  onRemoveImage,
}: ProductImageUploadProps) {
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: "picture1" | "picture2" | "picture3" | "picture4",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image size must be less than 1MB");
        return;
      }

      onImageChange(e, imageKey);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Product Images</Label>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {(["picture1", "picture2", "picture3", "picture4"] as const).map(
          (imageKey, index) => (
            <div key={imageKey} className="space-y-2">
              <Label className="text-sm text-gray-600">
                Image {index + 1}
                {index === 0 && " (Main)"}
              </Label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                {imagePreviews[imageKey] ? (
                  <div className="relative">
                    <Image
                      src={imagePreviews[imageKey]!}
                      alt={`Preview ${index + 1}`}
                      width={150}
                      height={150}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(imageKey)}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, imageKey)}
                      className="hidden"
                    />
                    <div className="flex h-32 flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 hover:text-gray-600">
                      <Upload className="mb-2 h-8 w-8" />
                      <span className="text-sm">Upload Image</span>
                    </div>
                  </label>
                )}
              </div>
            </div>
          ),
        )}
      </div>
      <p className="text-sm text-gray-500">
        Upload up to 4 images. Recommended size: 500x500px. Max size: 1MB each.
        Leave empty to keep existing images.
      </p>
    </div>
  );
}
