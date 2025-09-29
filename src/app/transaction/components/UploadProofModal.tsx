import React, { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  isUploading: boolean;
};

export function UploadProofModal({ isOpen, onClose, onSubmit, isUploading }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button type="button" onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3">✕</button>
        <h3 className="text-lg font-bold">Upload Payment Proof</h3>
        <p className="py-2 text-sm">Please upload your payment receipt.</p>
        <input type="file" accept="image/*" onChange={handleFileChange} className="file-input file-input-bordered w-full mt-2" />
        {selectedFile && (
          <div className="mt-3 text-sm">
            <p>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
          </div>
        )}
        <div className="modal-action">
          <button onClick={onClose} className="btn">Cancel</button>
          <button onClick={handleSubmit} className={`btn btn-primary ${isUploading ? "loading" : ""}`} disabled={!selectedFile || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}