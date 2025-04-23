import React, { useState } from "react";
import { motion } from "framer-motion";
import { SquarePen, Mail, Phone, Wallet, User } from "lucide-react";
import { toast } from "sonner";
import Loading from "@/components/global/Loading";
import EditProfileModal from "./components/EditProfileModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { useUserProfile } from "@/hooks/user/useUserQueries";

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
  const { data: profile, isLoading: isProfileLoading, error, refetch } = useUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const openEditModal = () => {
    if (profile) {
      setIsEditModalOpen(true);
    } else {
      toast.error("Profile data not available yet.");
    }
  };

  const openPasswordModal = () => {
    if (profile) {
      setIsPasswordModalOpen(true);
    } else {
      toast.error("Profile data not available yet.");
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    refetch();
    setIsEditModalOpen(false);
    toast.success("Profile updated successfully!");
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

  if (error || !profile) {
    return (
      <div
        className="p-4 sm:p-8 mt-4 sm:mt-20 max-w-4xl mx-auto flex items-center justify-center text-red-500"
        style={{ minHeight: "300px" }}
      >
        {error ? `Error: ${error.message}` : "Failed to load profile data."}
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-4 sm:p-8 space-y-6 sm:space-y-8 mt-4 sm:mt-20 rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - profile photo and name */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-auto md:flex-shrink-0 p-4 sm:p-6 flex flex-col items-center justify-center bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 rounded-t-lg md:rounded-tr-none md:rounded-l-lg"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <img
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md"
                src={getProfileImageSrc(profile.profile_picture)}
                alt="Profile avatar"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={openEditModal}
                className="absolute bottom-0 right-0 bg-[#b9a089] p-2 rounded-full text-white shadow-lg hover:bg-[#a58e77] transition"
                aria-label="Edit profile"
              >
                <SquarePen className="h-4 w-4" />
              </motion.button>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-lg sm:text-xl font-dm_sans text-gray-900 text-center"
            >
              {profile.fullName}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-gray-500 text-xs sm:text-sm text-center font-dm_sans break-all px-2"
            >
              {profile.email}
            </motion.p>
          </motion.div>

          {/* Right side - profile information */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 p-4 sm:p-6"
          >
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base sm:text-2xl font-dm_sans text-gray-900 mb-4 sm:mb-6 border-b pb-2"
            >
              Profile Information
            </motion.h3>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-7 gap-x-4 sm:gap-x-8">
                {[
                  { icon: User, label: "name", value: profile.fullName },
                  { icon: Mail, label: "email", value: profile.email },
                  { icon: Phone, label: "phone", value: profile.phone },
                  { icon: Wallet, label: "wallet", value: `₹ ${profile.wallet || 0}` }
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                    className="flex items-center font-dm_sans"
                  >
                    <item.icon
                      className="text-[#b9a089] mr-2 sm:mr-3 flex-shrink-0"
                      size={18}
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-dm_sans text-gray-500">
                        {item.label}*
                      </h4>
                      <p className="mt-1 text-sm sm:text-base text-gray-900 truncate">
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4 font-dm_sans"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openPasswordModal}
                  className="bg-[#b9a089] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-[#a58e77] transition text-xs sm:text-sm"
                >
                  change password
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openEditModal}
                  className="bg-[#b9a089] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-[#a58e77] transition text-xs sm:text-sm"
                >
                  edit profile
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

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
