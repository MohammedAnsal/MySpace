import React, { useState, useRef } from "react";
import { Loader2, Camera } from "lucide-react";
import Modal from "@/components/global/Modal";
import { toast } from "sonner";
import { editProfile, findUser } from "@/services/Api/userApi";
import { z } from "zod";

interface UserProfile {
  fullName: string;
  email: string;
  profile_picture: string;
  phone: string;
  wallet: number;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

// Profile validation schema
const profileEditSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .transform((val) => val.trim())
    .refine((val) => !isNaN(Number(val)), {
      message: "Invalid phone number format",
    }),
});

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}) => {
  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens with new profile data
  React.useEffect(() => {
    if (isOpen) {
      setEditableProfile(profile);
      setImagePreview(null);
      setImageFile(null);
      setValidationErrors({});
    }
  }, [isOpen, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile({
      ...editableProfile,
      [name]: value,
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const handleSaveProfile = async () => {
    // Validate form before submission
    try {
      profileEditSchema.parse({
        fullName: editableProfile.fullName,
        phone: editableProfile.phone,
      });
      
      // Clear all validation errors
      setValidationErrors({});
      
      setIsLoading(true);
      try {
        const formData = new FormData();

        formData.append("fullName", editableProfile.fullName);
        formData.append("phone", editableProfile.phone);

        if (imageFile) {
          formData.append("profile", imageFile);
        }

        const response = await editProfile(formData);

        if (response && response.success) {
          const updatedUserData = await findUser();
          if (updatedUserData && updatedUserData.data) {
            onProfileUpdate(updatedUserData.data);
          }
          toast.success("Profile updated successfully!");
        } else {
          toast.error(response?.message || "Failed to update profile");
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        toast.error("Failed to update profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(errors);
        toast.error("Please fix the validation errors");
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getProfileImageSrc = (imageUrl: string | null | undefined) => {
    if (imagePreview) return imagePreview;
    if (imageUrl && imageUrl.trim() !== "") return imageUrl;
    return DEFAULT_AVATAR;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}
      title="Edit Profile"
    >
      <div className="space-y-4">
        {/* Profile Image Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={getProfileImageSrc(profile.profile_picture)}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                // Fallback if the image fails to load
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <button
              type="button"
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-[#b9a089] p-2 rounded-full text-white shadow-md hover:bg-[#a58e77] transition"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              type="file"
              name="profile"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="fullName"
            value={editableProfile.fullName}
            onChange={handleChange}
            disabled={isLoading}
            className={`mt-1 block w-full px-3 py-2 border ${
              validationErrors.fullName ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-[#b9a089] focus:border-[#b9a089]`}
          />
          {validationErrors.fullName && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            disabled
            type="email"
            name="email"
            value={editableProfile.email}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#b9a089] focus:border-[#b9a089] bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={editableProfile.phone}
            onChange={handleChange}
            disabled={isLoading}
            className={`mt-1 block w-full px-3 py-2 border ${
              validationErrors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-[#b9a089] focus:border-[#b9a089]`}
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="bg-[#b9a089] text-white px-4 py-2 rounded-md hover:bg-[#a58e77] transition disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal; 