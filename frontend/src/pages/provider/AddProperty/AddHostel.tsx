import React, { useState, useEffect } from "react";
import { HostelInstructionModal } from "./components/HostelInstructionModal";
import MapPicker from "@/pages/provider/AddProperty/components/MapPicker";
import { HouseRules } from "./components/HouseRules";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { FacilitiesSection } from "./components/FacilitiesSection";
import { ImageUploadSection } from "./components/ImageUploadSection";
import { LocationSection } from "./components/LocationSection";
import { DetailsSection } from "./components/DetailsSection";
import { BasicInformation } from "./components/BasicInformation";
import {
  HostelFormData,
  hostelValidationSchema,
} from "@/utils/validation/propertyValidation";
import { z } from "zod";
import { createHostel } from "@/services/Api/providerApi";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { isValidImageFormat, compressImage } from "@/utils/imageCompression";
import { ImageCompressionProgress } from "@/components/ui/ImageCompressionProgress";

interface PropertyForm {
  hostel_name: string;
  description: string;
  address: string;
  monthly_rent: string;
  propertyType: string;
  gender: string;
  amenities: string[];
  maximum_occupancy: string;
  deposit_amount: string;
  rules: string;
  available_space: string;
  facilities: string[];
  latitude: number | null;
  longitude: number | null;
  total_space: string;
  deposit_terms: string;
}

export const AddHostel: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [formData, setFormData] = useState<PropertyForm>({
    hostel_name: "",
    description: "",
    address: "",
    monthly_rent: "",
    propertyType: "hostel",
    gender: "",
    amenities: [],
    maximum_occupancy: "",
    available_space: "",
    deposit_amount: "",
    rules: "",
    facilities: [],
    latitude: null,
    longitude: null,
    total_space: "",
    deposit_terms: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();
  // const [firstTimeUser, setFirstTimeUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageError, setImageError] = useState("");
  const [mapVisible, setMapVisible] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof HostelFormData, string>>
  >({});
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  let flag = 0;

  useEffect(() => {
    if (showInstructions) {
      flag = 1;
      if (flag == 1) {
        setShowInstructions(false);
      }
    }
  }, []);

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  Handle Amenity Section

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  //  Handle Facility Sacetion

  const handleFacilityToggle = (facilityId: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter((f) => f !== facilityId)
        : [...prev.facilities, facilityId],
    }));
  };

  //  Handle Image Upload

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files || []);

      // Check file types and sizes
      for (const file of newImages) {
        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          setImageError(
            `File "${file.name}" is too large. Maximum size is 10MB`
          );
          return;
        }

        if (!isValidImageFormat(file)) {
          setImageError(
            `File "${file.name}" is not supported. Please use JPG, JPEG, or PNG files.`
          );
          return;
        }
      }

      if (images.length + newImages.length > 5) {
        setImageError(
          "Maximum 5 images allowed. Please remove some images first."
        );
        return;
      }

      try {
        setIsCompressing(true);
        setCompressionProgress(0);

        const compressedImages: File[] = [];

        for (let i = 0; i < newImages.length; i++) {
          const compressed = await compressImage(newImages[i], {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            fileType: "image/jpeg",
          });

          compressedImages.push(compressed);
          setCompressionProgress(((i + 1) / newImages.length) * 100);
        }

        setImages((prev) => [...prev, ...compressedImages]);
        setImageError("");
      } catch (error) {
        console.error("Image compression error:", error);
        setImageError("Failed to compress images. Please try again.");
      } finally {
        setIsCompressing(false);
        setCompressionProgress(0);
      }
    }
  };

  //  Handle Remove Image

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageError("");
  };

  //  Handle Location Selection

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng,
    }));
    setMapVisible(false);
  };

  //  Handle Validation

  const validateForm = (): boolean => {
    try {
      hostelValidationSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof HostelFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof HostelFormData] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  //  Handle Sumbit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (images.length === 0) {
    //   toast.error("Please upload at least one image of your property.");
    //   return;
    // }

    if (!validateForm()) {
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("hostel_name", formData.hostel_name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("monthly_rent", formData.monthly_rent);
      formDataToSend.append("deposit_amount", formData.deposit_amount);
      formDataToSend.append("maximum_occupancy", formData.maximum_occupancy);
      formDataToSend.append("total_space", formData.total_space);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("rules", formData.rules);
      formDataToSend.append("deposit_terms", formData.deposit_terms);

      formDataToSend.append("latitude", formData.latitude?.toString() || "");
      formDataToSend.append("longitude", formData.longitude?.toString() || "");
      formDataToSend.append("address", formData.address);

      formData.amenities.forEach((amenity) => {
        formDataToSend.append("amenities", amenity);
      });

      formDataToSend.append("facilities", formData.facilities.join(","));

      images.forEach((image) => {
        formDataToSend.append("photos", image);
      });

      const response = await createHostel(formDataToSend);

      if (response.success) {
        toast.success("Hostel added successfully!");
        setSubmitSuccess(true);

        setFormData({
          hostel_name: "",
          description: "",
          address: "",
          monthly_rent: "",
          propertyType: "hostel",
          gender: "",
          amenities: [],
          maximum_occupancy: "",
          available_space: "",
          deposit_amount: "",
          rules: "",
          facilities: [],
          latitude: null,
          longitude: null,
          total_space: "",
          deposit_terms: "",
        });
        setImages([]);
        setImageError("");
      } else {
        toast.error(response.message || "Failed to create hostel");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen pb-8">
      <Toaster position="top-right" richColors />

      <ImageCompressionProgress
        isCompressing={isCompressing}
        progress={compressionProgress}
      />

      {showInstructions && (
        <HostelInstructionModal onClose={handleCloseInstructions} />
      )}

      <div className="p-4 lg:p-6 max-w-6xl mx-auto">
        {submitSuccess ? (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg text-center my-8">
            <div className="flex flex-col justify-center items-center">
              <div className="flex bg-amber-100 h-16 justify-center rounded-full w-16 items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 text-amber-600 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl text-gray-800 font-semibold mb-2">
                Property Added Successfully!
              </h2>
              <p className="text-gray-700 mb-4">
                Your hostel has been listed and is now visible to potential
                clients.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-amber-400 rounded-lg text-gray-800 hover:bg-amber-500 px-6 py-2 transition-colors"
              >
                Add Another Property
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl text-gray-800 font-semibold mb-2 sm:mb-0">
                Add New Hostel Accommodation
              </h1>
              <button
                onClick={() => setShowInstructions(true)}
                className="flex text-amber-600 hover:text-amber-700 items-center self-start sm:self-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Show Instructions
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInformation
                formData={formData}
                errors={formErrors}
                handleInputChange={handleInputChange}
              />

              <LocationSection
                formData={formData}
                errors={formErrors}
                handleInputChange={handleInputChange}
                setMapVisible={setMapVisible}
              />

              <DetailsSection
                formData={formData}
                errors={formErrors}
                handleInputChange={handleInputChange}
              />

              <HouseRules
                formData={formData}
                errors={formErrors}
                handleInputChange={handleInputChange}
              />

              <AmenitiesSection
                formData={formData}
                errors={formErrors}
                handleAmenityToggle={handleAmenityToggle}
              />

              <FacilitiesSection
                // availableFacilities={availableFacilities}
                formData={formData}
                errors={formErrors}
                handleFacilityToggle={handleFacilityToggle}
              />

              <ImageUploadSection
                images={images}
                imageError={imageError}
                // errors={formErrors}
                handleImageUpload={handleImageUpload}
                handleRemoveImage={handleRemoveImage}
              />

              <div className="flex flex-col mt-6 sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate(-1);
                  }}
                  className="border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 px-6 py-3 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg transition-colors flex items-center justify-center font-medium ${
                    isSubmitting
                      ? "bg-amber-200 text-amber-800 cursor-not-allowed"
                      : "bg-amber-400 hover:bg-amber-500 text-gray-800"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-4 text-amber-800 w-4 -ml-1 animate-spin mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding Property...
                    </>
                  ) : (
                    "Add Property"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {mapVisible && (
        <MapPicker
          onSelectLocation={handleLocationSelect}
          onClose={() => setMapVisible(false)}
        />
      )}
    </div>
  );
};
