import React, { useState } from "react";
import { Camera, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface UserProfile {
  name: string | null;
  email: string | null;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
}

const Profile: React.FC = () => {
  const { fullName, email } = useSelector((state: RootState) => state.user);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: fullName,
    email: email,
    phone: "+1 234 567 890",
    address: "123 Main St, City, Country",
    bio: "Experienced property manager with a passion for hospitality and customer service. Managing premium properties since 2018.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfile((prev) => ({
            ...prev,
            avatar: event?.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header/Cover Image */}
          <div className="h-32 bg-gradient-to-r from-amber-200 to-amber-100"></div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Avatar Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start">
              <div className="relative -mt-20 mb-4 lg:mb-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={tempProfile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-amber-200 rounded-full cursor-pointer hover:bg-amber-300 transition-colors">
                    <Camera size={20} className="text-gray-700" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 lg:ml-6 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={tempProfile.name}
                        onChange={handleInputChange}
                        className="text-2xl font-bold mb-2 px-2 py-1 border rounded focus:ring-2 focus:ring-amber-200 outline-none"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold mb-2">
                        {profile.name}
                      </h1>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0">
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center px-4 py-2 bg-amber-200 rounded-lg hover:bg-amber-300 transition-colors"
                        >
                          <Save size={20} className="mr-2" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <X size={20} className="mr-2" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-amber-200 rounded-lg hover:bg-amber-300 transition-colors"
                      >
                        <Edit2 size={20} className="mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="text-gray-400 mr-2" size={20} />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={tempProfile?.email}
                        onChange={handleInputChange}
                        className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-amber-200 outline-none"
                      />
                    ) : (
                      <span>{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-gray-400 mr-2" size={20} />
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={tempProfile.phone}
                        onChange={handleInputChange}
                        className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-amber-200 outline-none"
                      />
                    ) : (
                      <span>{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={20} />
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={tempProfile.address}
                        onChange={handleInputChange}
                        className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-amber-200 outline-none"
                      />
                    ) : (
                      <span>{profile.address}</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">About Me</h2>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={tempProfile.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                ) : (
                  <p className="text-gray-600">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
