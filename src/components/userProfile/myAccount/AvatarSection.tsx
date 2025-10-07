"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/userProfile/myAccount/Avatar";
import { Button } from "@/components/ui/button";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useGetUserProfileInfo } from "@/hooks/userProfile/useGetUserProfileInfo";
import { baseError } from "@/components/userAuth/typesAndInterfaces";

export const AvatarSection = () => {
  const { accessToken } = useUserAuthStore();
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // !HOOKS
  const { data: userProfileInfo } = useGetUserProfileInfo(accessToken);
  const { mutate: upload, isPending } = useMutation({
    mutationFn: async (imageFile: File) => {
      const form = new FormData();
      form.append("avatar", imageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        },
      );

      if (!res.ok) throw new Error("Upload failed");
      return res.json() as Promise<{ profilePicture: string }>;
    },
    onSuccess: () => {
      // refresh user info in both nav + page
      queryClient.invalidateQueries({ queryKey: ["userProfileInfo"] });
      setPreview(null);
      setFile(null);
      toast.success("Avatar updated");
    },
    onError: (error: baseError) => {
      toast.error(`${error.response.status} | ${error.response.data.message}`);
    },
  });

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1_048_576) {
      toast.error("Max 1 MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSave = () => {
    if (file) upload(file);
    if (fileInputRef.current) fileInputRef.current.value = ""; // allow re-upload same file
  };

  const onCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        className="hidden"
        onChange={onFilePick}
      />

      {/* clickable avatar */}
      <Avatar
        src={preview || userProfileInfo?.profilePicture}
        alt="user"
        size={96}
        className="my-4"
        onClick={() => fileInputRef.current?.click()}
      />

      {/* action buttons when a new image is selected */}
      {preview && (
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
