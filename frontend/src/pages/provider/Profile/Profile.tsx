import React, { useEffect, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  Lock,
  User,
  Calendar,
  Shield,
  IndianRupee,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { editProfile } from "@/services/Api/providerApi";
import Loading from "@/components/global/Loading";
import ChangePasswordModal from "./components/ChangePasswordModal";
import WalletSummary from "../wallet/components/WalletSummary";
import { useProviderProfile } from "@/hooks/provider/profile/useProfile";

export interface ProviderProfile {
  fullName: string | null;
  email: string;
  phone: string;
  profile_picture: string;
  documentType?: "aadhar" | "pan" | "passport" | "driving_license";
  documentImage?: string;
  isDocumentVerified?: boolean;
}

const Profile: React.FC = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useProviderProfile();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [showDocumentImage, setShowDocumentImage] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProviderProfile | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "wallet" | "documents">("personal");

  useEffect(() => {
    if (profile) {
      setTempProfile(profile);
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!tempProfile) {
      toast.error("Profile data is not available to save.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", tempProfile.fullName || "");
      formData.append("phone", tempProfile.phone || "");

      if (imageFile) {
        formData.append("profile", imageFile);
      }

      const response = await editProfile(formData);

      if (response && response.success) {
        refetch();
        setIsEditing(false);
        setImageFile(null);
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
  };

  const handleCancel = () => {
    if (profile) {
      setTempProfile(profile);
    }
    setIsEditing(false);
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfile((prev) =>
            prev
              ? { ...prev, profile_picture: event.target?.result as string }
              : null
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getDocumentTypeLabel = (type?: string) => {
    switch (type) {
      case "aadhar":
        return "Aadhar Card";
      case "pan":
        return "PAN Card";
      case "passport":
        return "Passport";
      case "driving_license":
        return "Driving License";
      default:
        return "Not Provided";
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block mb-4">
            <Loading color="#FFB300" text="" />
          </div>
          <p className="text-gray-600 font-medium">loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500">
          {error ? `Error: ${error.message}` : "Failed to load profile data."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and wallet
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-amber-100">
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-amber-300 to-amber-100"></div>
            <div className="absolute top-0 right-0 p-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-700"
                >
                  <Edit2 size={18} className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-amber-400 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 text-gray-800 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loading size="small" text="" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-700 shadow-sm"
                  >
                    <X size={18} className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 flex flex-col md:flex-row">
            <div className="relative -mt-16 mb-4 md:mb-0 flex-shrink-0 self-center md:self-start">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-100 shadow-md">
                {tempProfile?.profile_picture ? (
                  <img
                    src={tempProfile.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/150?text=Profile";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-50">
                    <User size={40} className="text-amber-300" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-amber-400 rounded-full cursor-pointer hover:bg-amber-500 transition-colors shadow-sm">
                  <Camera size={18} className="text-gray-800" />
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1 md:ml-6 text-center md:text-left">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={tempProfile?.fullName || ""}
                    onChange={handleInputChange}
                    className="text-2xl font-bold mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none w-full md:w-auto"
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.fullName || "Not Set"}
                  </h2>
                )}
                <p className="text-gray-600 mb-4">Property Provider</p>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-2 text-amber-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2 text-amber-500" />
                  <span>
                    {isEditing
                      ? tempProfile?.phone || "Not provided"
                      : profile.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2 text-amber-500" />
                  <span>
                    Joined{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="flex flex-wrap">
              <button
                className={`flex-1 py-3 px-4 font-medium text-center ${
                  activeTab === "personal"
                    ? "text-amber-600 border-b-2 border-amber-400"
                    : "text-gray-600 hover:text-amber-500"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                <div className="flex items-center justify-center">
                  <User size={16} className="mr-2" />
                  <span>Personal Information</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 px-4 font-medium text-center ${
                  activeTab === "documents"
                    ? "text-amber-600 border-b-2 border-amber-400"
                    : "text-gray-600 hover:text-amber-500"
                }`}
                onClick={() => setActiveTab("documents")}
              >
                <div className="flex items-center justify-center">
                  <FileText size={16} className="mr-2" />
                  <span>Documents</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 px-4 font-medium text-center ${
                  activeTab === "wallet"
                    ? "text-amber-600 border-b-2 border-amber-400"
                    : "text-gray-600 hover:text-amber-500"
                }`}
                onClick={() => setActiveTab("wallet")}
              >
                <div className="flex items-center justify-center">
                  <IndianRupee size={16} className="mr-2" />
                  <span>Wallet</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <User size={20} className="mr-2 text-amber-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        Email Address
                      </p>
                      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                        <Mail className="text-amber-500 mr-3" size={18} />
                        <p className="text-gray-800">{profile.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        Phone Number
                      </p>
                      {isEditing ? (
                        <div className="flex items-center bg-white p-2 rounded-lg border border-gray-200">
                          <Phone
                            className="text-amber-500 ml-1 mr-3"
                            size={18}
                          />
                          <input
                            type="tel"
                            name="phone"
                            value={tempProfile?.phone || ""}
                            onChange={handleInputChange}
                            className="flex-1 px-2 py-1 focus:outline-none"
                            placeholder="Phone Number"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                          <Phone className="text-amber-500 mr-3" size={18} />
                          <p className="text-gray-800">
                            {profile.phone || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <Shield size={20} className="mr-2 text-amber-500" />
                    Account Security
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        Password
                      </p>
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <Lock className="text-amber-500 mr-3" size={18} />
                          <p className="text-gray-800">••••••••••</p>
                        </div>
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        Account Status
                      </p>
                      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                          <p className="text-gray-800">Active</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">
                        Member Since
                      </p>
                      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                        <Calendar className="text-amber-500 mr-3" size={18} />
                        <p className="text-gray-800">
                          {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                  <FileText size={20} className="mr-2 text-amber-500" />
                  Document Verification
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold mb-4 text-gray-800">
                      Document Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">
                          Document Type
                        </p>
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <FileText className="text-amber-500 mr-3" size={18} />
                          <p className="text-gray-800">
                            {getDocumentTypeLabel(profile.documentType)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">
                          Verification Status
                        </p>
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                          {profile.isDocumentVerified ? (
                            <>
                              <CheckCircle
                                className="text-green-500 mr-3"
                                size={18}
                              />
                              <p className="text-green-600 font-medium">
                                Verified
                              </p>
                            </>
                          ) : (
                            <>
                              <AlertCircle
                                className="text-yellow-500 mr-3"
                                size={18}
                              />
                              <p className="text-yellow-600 font-medium">
                                Pending Verification
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold mb-4 text-gray-800">
                      Document Image
                    </h4>
                    {profile.documentImage ? (
                      <div className="relative">
                        <img
                          src={profile.documentImage}
                          alt="Document"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x200?text=Document+Image";
                          }}
                        />
                        <button
                          onClick={() => setShowDocumentImage(true)}
                          className="absolute top-2 right-2 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <FileText
                            size={48}
                            className="text-gray-400 mx-auto mb-2"
                          />
                          <p className="text-gray-500 text-sm">
                            No document uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <WalletSummary />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Image Modal */}
      {showDocumentImage && profile.documentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Document Image</h3>
              <button
                onClick={() => setShowDocumentImage(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <img
              src={profile.documentImage}
              alt="Document"
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/600x400?text=Document+Image";
              }}
            />
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
        email={profile.email}
      />
    </div>
  );
};

export default Profile;
