import React from "react";
import { Upload, X, AlertCircle } from "lucide-react";

interface ImageUploadSectionProps {
  images: File[];
  imageError: string;
  // errors: {
  //   photos?: string;
  // };
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  images,
  imageError,
  // errors,
  handleImageUpload,
  handleRemoveImage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-amber-100">
      <h2 className="text-xl font-medium mb-4 flex items-center text-gray-800">
        <Upload size={20} className="mr-2 text-amber-500" />
        Images (Maximum 5)
      </h2>

      <div className="border-2 border-dashed border-amber-200 rounded-lg p-4 sm:p-8 text-center bg-amber-50">
        <input
          type="file"
          name="photos"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="images"
          disabled={images.length >= 5}
        />
        <label
          htmlFor="images"
          className={`cursor-pointer flex flex-col items-center ${
            images.length >= 5 ? "opacity-50" : ""
          }`}
        >
          <Upload size={36} className="text-amber-500 mb-2" />
          <p className="text-gray-700 font-medium">
            {images.length >= 5
              ? "Maximum images reached"
              : "Click to upload images"}
          </p>
          <p className="text-sm text-gray-500">
            {images.length}/5 images uploaded
          </p>
        </label>
      </div>

      {imageError && (
        <div className="mt-2 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {imageError}
        </div>
      )}

      {/* {errors?.photos && (
        <div className="mt-2 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {errors.photos}
        </div>
      )} */}

      {images.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2 text-gray-700">
            Uploaded Images:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-amber-100"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-1 hover:bg-amber-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2">
                  {index === 0 ? "Main Image" : `Image ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * The first image will be used as the main display image for your
            property.
          </p>
        </div>
      )}
    </div>
  );
};
