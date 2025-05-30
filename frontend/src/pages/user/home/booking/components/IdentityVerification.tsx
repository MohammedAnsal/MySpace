import React from "react";
import { toast } from "sonner";

interface IdentityVerificationProps {
  userProof: File | null;
  onFileUpload: (file: File) => void;
  onRemoveFile: () => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  userProof,
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
      onFileUpload(file);
    }
  };

  return (
    <section className="mb-8 pb-6 border-b border-gray-200">
      <h2 className="font-serif font-normal text-2xl mb-5 text-gray-800 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gray-300">
        Step 1 - Identity Verification
      </h2>
      <div className="bg-gray-50 rounded-lg p-6">
        {userProof ? (
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">{userProof.name}</p>
                <p className="text-sm text-gray-500">
                  File uploaded successfully
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemoveFile()}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <label className="block">
              <span className="sr-only">Choose ID proof</span>
              <input
                type="file"
                name="proof"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
            <p className="mt-2 text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default IdentityVerification;
