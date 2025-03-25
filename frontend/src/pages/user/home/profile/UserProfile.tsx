import React, { useEffect, useState } from "react";
import { SquarePen, Mail, Phone, Wallet, User } from "lucide-react";
import { findUser } from "@/services/Api/userApi";
import { toast } from "sonner";
import Loading from "@/components/global/Loading";
import EditProfileModal from "./components/EditProfileModal";
import ChangePasswordModal from "./components/ChangePasswordModal";

interface UserProfile {
  fullName: string;
  email: string;
  profile_picture: string;
  phone: string;
  wallet: number;
}

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    profile_picture: "",
    phone: "",
    wallet: 0,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsProfileLoading(true);
      try {
        const response = await findUser();
        if (response && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Failed to load profile. Please try again.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditModalOpen(false);
  };

  const handlePasswordChange = () => {
    setIsPasswordModalOpen(false);
  };

  const getProfileImageSrc = (imageUrl: string | null | undefined) => {
    if (imageUrl && imageUrl.trim() !== "") return imageUrl;
    return DEFAULT_AVATAR;
  };

  if (isProfileLoading) {
    return (
      <div
        className="p-4 sm:p-8 mt-4 sm:mt-20 max-w-4xl mx-auto flex items-center justify-center"
        style={{ minHeight: "300px" }}
      >
        <Loading text="Loading profile..." />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 sm:p-8 space-y-6 sm:space-y-8 mt-4 sm:mt-20 rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left side - profile photo and name */}
          <div className="w-full md:w-auto md:flex-shrink-0 p-4 sm:p-6 flex flex-col items-center justify-center bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 rounded-t-lg md:rounded-tr-none md:rounded-l-lg">
            <div className="relative">
              <img
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md"
                src={getProfileImageSrc(profile.profile_picture)}
                alt="Profile avatar"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <button
                onClick={openEditModal}
                className="absolute bottom-0 right-0 bg-[#b9a089] p-2 rounded-full text-white shadow-lg hover:bg-[#a58e77] transition"
                aria-label="Edit profile"
              >
                <SquarePen className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 text-lg sm:text-xl font-dm_sans text-gray-900 text-center">
              {profile.fullName}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm text-center font-dm_sans break-all px-2">
              {profile.email}
            </p>
          </div>

          {/* Right side - profile information */}
          <div className="flex-1 p-4 sm:p-6">
            <h3 className="text-base sm:text-2xl font-dm_sans text-gray-900 mb-4 sm:mb-6 border-b pb-2">
              Profile Information
            </h3>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-7 gap-x-4 sm:gap-x-8">
                <div className="flex items-center font-dm_sans">
                  <User
                    className="text-[#b9a089] mr-2 sm:mr-3 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-dm_sans text-gray-500">
                      name*
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 truncate">
                      {profile.fullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center font-dm_sans">
                  <Mail
                    className="text-[#b9a089] mr-2 sm:mr-3 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-dm_sans text-gray-500">
                      email*
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-medium truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center font-dm_sans">
                  <Phone
                    className="text-[#b9a089] mr-2 sm:mr-3 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-dm_sans text-gray-500">
                      phone*
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-medium truncate">
                      {profile.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center font-dm_sans">
                  <Wallet
                    className="text-[#b9a089] mr-2 sm:mr-3 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-dm_sans text-gray-500">
                      wallet*
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-medium truncate">
                      ₹ {0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4 font-dm_sans">
                <button
                  onClick={openPasswordModal}
                  className="bg-[#b9a089] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-[#a58e77] transition text-xs sm:text-sm"
                >
                  change password
                </button>
                <button
                  onClick={openEditModal}
                  className="bg-[#b9a089] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-[#a58e77] transition text-xs sm:text-sm"
                >
                  edit profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Component */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Change Password Modal Component */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        email={profile.email}
        onPasswordChange={handlePasswordChange}
      />
    </>
  );
};

export default UserProfile;
