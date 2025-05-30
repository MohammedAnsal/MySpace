import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHostelById, updateHostel } from "@/services/Api/providerApi";
import { toast } from "sonner";
import Loading from "@/components/global/Loading";
import MapPicker from "@/pages/provider/AddProperty/components/MapPicker";
import { HouseRules } from "../../AddProperty/components/HouseRules";
import { AmenitiesSection } from "../../AddProperty/components/AmenitiesSection";
import { FacilitiesSection } from "../../AddProperty/components/FacilitiesSection";
import { ImageUploadSection } from "../../AddProperty/components/ImageUploadSection";
import { LocationSection } from "../../AddProperty/components/LocationSection";
import { DetailsSection } from "../../AddProperty/components/DetailsSection";
import { BasicInformation } from "../../AddProperty/components/BasicInformation";
import { hostelValidationSchema } from "@/utils/validation/propertyValidation";
import { z } from "zod";

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
  facilities: string[];
  latitude: number | null;
  longitude: number | null;
  total_space: string;
  deposit_terms: string;
}

const EditHostel = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [mapVisible, setMapVisible] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof PropertyForm, string>>
  >({});

  const [formData, setFormData] = useState<PropertyForm>({
    hostel_name: "",
    description: "",
    address: "",
    monthly_rent: "",
    propertyType: "hostel",
    gender: "",
    amenities: [],
    maximum_occupancy: "",
    deposit_amount: "",
    rules: "",
    facilities: [],
    latitude: null,
    longitude: null,
    total_space: "",
    deposit_terms: "",
  });

  // Fetch hostel details
  const { data: hostel, isLoading } = useQuery({
    queryKey: ["hostel", hostelId],
    queryFn: () => {
      if (!hostelId) throw new Error("Hostel ID is required");
      return getHostelById(hostelId);
    },
    enabled: !!hostelId,
  });

  // Set form data when hostel data is loaded
  useEffect(() => {
    if (hostel) {
      const data = hostel.data;
      
      // Extract facility IDs from facility objects
      const facilityIds = Array.isArray(data.facilities) 
        ? data.facilities.map((facility: any) => facility._id || facility)
        : [];
      
      setFormData({
        hostel_name: data.hostel_name || "",
        description: data.description || "",
        address: data.location?.address || "",
        monthly_rent: data.monthly_rent?.toString() || "",
        propertyType: "hostel",
        gender: data.gender || "",
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        maximum_occupancy: data.maximum_occupancy?.toString() || "",
        deposit_amount: data.deposit_amount?.toString() || "",
        rules: data.rules || "",
        facilities: facilityIds,
        latitude: data.location?.latitude || null,
        longitude: data.location?.longitude || null,
        total_space: data.total_space?.toString() || "",
        deposit_terms: data.deposit_terms || "",
      });

      // If there are existing photos, you might want to display them
      if (data.photos && Array.isArray(data.photos)) {
        // You might need to modify this depending on how you want to handle existing photos
        setExistingPhotos(data.photos);
      }

    }
  }, [hostel]);

  // Add state for existing photos
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

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

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFacilityToggle = (facilityId: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter((f) => f !== facilityId)
        : [...prev.facilities, facilityId],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files || []);
      if (images.length + newImages.length > 5) {
        setImageError("Maximum 5 images allowed");
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
      setImageError("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

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

  const validateForm = (): boolean => {
    try {
      hostelValidationSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof PropertyForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof PropertyForm] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      const basicFields = {
        hostel_name: formData.hostel_name,
        description: formData.description,
        monthly_rent: formData.monthly_rent,
        deposit_amount: formData.deposit_amount,
        maximum_occupancy: formData.maximum_occupancy,
        total_space: formData.total_space,
        gender: formData.gender,
        rules: formData.rules,
        deposit_terms: formData.deposit_terms,
        address: formData.address,
      };

      // Append basic fields
      Object.entries(basicFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Location data
      if (formData.latitude !== null) {
        formDataToSend.append("latitude", formData.latitude.toString());
      }
      if (formData.longitude !== null) {
        formDataToSend.append("longitude", formData.longitude.toString());
      }

      // Arrays - use JSON.stringify
      if (formData.amenities.length > 0) {
        formDataToSend.append("amenities", JSON.stringify(formData.amenities));
      }

      if (formData.facilities.length > 0) {
        formDataToSend.append(
          "facilities",
          JSON.stringify(formData.facilities)
        );
      }

      // Existing photos
      if (existingPhotos.length > 0) {
        formDataToSend.append("photos", JSON.stringify(existingPhotos));
      }

      // New photos
      images.forEach((image) => {
        formDataToSend.append("photos", image);
      });

      const response = await updateHostel(hostelId!, formDataToSend);

      if (response.success) {
        toast.success("Hostel updated successfully");
        navigate("/provider/hostels");
      }
    } catch (error) {
      console.error("Error updating hostel:", error);
      toast.error("Failed to update hostel");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modify the ImageUploadSection to handle both existing and new photos

  const ImageUploadWithExisting = () => (
    <div className="space-y-4">
      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Existing Photos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingPhotos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Existing photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setExistingPhotos(
                      existingPhotos.filter((_, i) => i !== index)
                    );
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Photos Upload Section */}
      <ImageUploadSection
        images={images}
        imageError={imageError}
        // errors={formErrors}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading text="Loading hostel details" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full min-h-screen pb-8">
      <div className="p-4 lg:p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl text-gray-800 font-semibold mb-6">
          Edit Hostel: {hostel?.hostel_name}
        </h1>

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
            formData={formData}
            errors={formErrors}
            handleFacilityToggle={handleFacilityToggle}
          />

          <ImageUploadWithExisting />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/provider/hostels")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg ${
                isSubmitting
                  ? "bg-amber-300 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600"
              } text-white`}
            >
              {isSubmitting ? "Updating..." : "Update Hostel"}
            </button>
          </div>
        </form>
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

export default EditHostel;
