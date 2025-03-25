import { useNavigate } from "react-router-dom";
// import Sidebar from "@/components/provider/Sidebar";
import { Users, Home, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { findProvider } from "@/services/Api/providerApi";
import { toast } from "sonner";

interface Metric {
  title: string;
  count: number;
  color: string;
  icon: JSX.Element;
}

interface UserProfile {
  fullName: string | null;

  profile_picture: string;
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    profile_picture: "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  useEffect(() => {
    const loadProviderProfile = async () => {
      setIsProfileLoading(true);
      try {
        const response = await findProvider();
        if (response && response.data) {
          setProfile(response.data.data);
          setTempProfile(response.data.data);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Failed to load profile. Please try again.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProviderProfile();
  }, []);

  const metrics: Metric[] = [
    {
      title: "Users",
      count: 32,
      color: "bg-indigo-600",
      icon: <Users size={20} color="white" />,
    },
    {
      title: "Properties",
      count: 54,
      color: "bg-orange-400",
      icon: <Home size={20} color="white" />,
    },
    {
      title: "Accommodation",
      count: 40,
      color: "bg-yellow-400",
      icon: <Home size={20} color="white" />,
    },
    {
      title: "Bookings",
      count: 30,
      color: "bg-indigo-800",
      icon: <Calendar size={20} color="white" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-x-hidden">
        <div className="p-4 lg:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
              Dashboard
            </h1>
            <div
              className="flex items-center cursor-pointer bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              onClick={() => navigate("/provider/profile")}
            >
              <span className="mr-2 text-gray-800 hidden sm:inline">
                {profile.fullName}
              </span>
              <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                <img
                  src={tempProfile.profile_picture}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/150?text=Profile";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`${metric.color} w-12 h-12 rounded-full flex items-center justify-center shadow-md`}
                    >
                      {metric.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        {metric.title}
                      </div>
                      <div className="text-xl lg:text-2xl font-semibold">
                        {metric.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
