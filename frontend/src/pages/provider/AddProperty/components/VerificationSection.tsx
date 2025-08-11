import React from "react";
import { AlertCircle, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface VerificationSectionProps {
  proofFile: File | null;
  error?: string;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
}

export const VerificationSection: React.FC<VerificationSectionProps> = ({
  proofFile,
  error,
  onFileUpload,
  onRemoveFile,
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      // Accept PDF/JPG/PNG
      const ok =
        ["application/pdf", "image/jpeg", "image/png"].includes(file.type) ||
        /\.(pdf|jpg|jpeg|png)$/i.test(file.name);
      if (!ok) {
        toast.error("Accepted formats: PDF, JPG, PNG");
        return;
      }
      onFileUpload(file);
    }
  };

  const isImage =
    !!proofFile &&
    (proofFile.type.startsWith("image/") ||
      /\.(jpg|jpeg|png)$/i.test(proofFile.name));

  const previewUrl = React.useMemo(
    () => (proofFile ? URL.createObjectURL(proofFile) : ""),
    [proofFile]
  );

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-amber-100">
      <h2 className="text-xl font-medium mb-4 flex items-center text-gray-800">
        <FileText size={20} className="mr-2 text-amber-500" />
        Property Verification Document
      </h2>

      {!proofFile ? (
        <div className="border-2 border-dashed border-amber-200 rounded-lg p-6 text-center bg-amber-50">
          <input
            type="file"
            name="property_proof"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={handleFileUpload}
            className="hidden"
            id="proof-input"
          />
          <label
            htmlFor="proof-input"
            className="cursor-pointer flex flex-col items-center"
          >
            <FileText size={36} className="text-amber-500 mb-2" />
            <p className="text-gray-700 font-medium">
              Upload Proof of Property Ownership
            </p>
            <p className="text-sm text-gray-500">
              Accepted: PDF, JPG, PNG. Max 5MB.
            </p>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              {isImage ? (
                <img
                  src={previewUrl}
                  alt="Property proof"
                  className="w-16 h-16 object-cover rounded-md border"
                />
              ) : (
                <FileText className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{proofFile.name}</p>
              <p className="text-sm text-gray-500">
                Valid Property License or Registration Certificate
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isImage && previewUrl ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-amber-700 hover:text-amber-800"
              >
                View
              </a>
            ) : null}
            <button
              type="button"
              onClick={onRemoveFile}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <X size={16} className="mr-1" />
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};
