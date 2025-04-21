import { useNavigate } from "react-router-dom";
// import Sidebar from "@/components/provider/Sidebar";
import { Users, Home, Calendar, IndianRupeeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { findProvider } from "@/services/Api/providerApi";
import { toast } from "sonner";
import { useProviderDashboard } from "@/hooks/provider/useProviderQueries";
import Loading from "@/components/global/Loading";
import RevenueAnalytics from "@/pages/provider/Home/components/RevenueAnalytics";
import DistributionChart from "@/pages/provider/Home/components/DistributionChart";

interface Metric {
  title: string;
  count: number | string;
  color: string;
  icon: JSX.Element;
}

interface UserProfile {
  fullName: string | null;
  profile_picture: string;
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useProviderDashboard();

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    profile_picture: "",
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    const loadProviderProfile = async () => {
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
      }
    };

    loadProviderProfile();
  }, []);

  const formatCurrency = (value: number) => {
    return "$" + value.toLocaleString("en-US");
  };

  const metrics: Metric[] = [
    {
      title: "Users",
      count: dashboardData?.users || 0,
      color: "bg-indigo-600",
      icon: <Users size={20} color="white" />,
    },
    {
      title: "Hostels",
      count: dashboardData?.hostels || 0,
      color: "bg-orange-400",
      icon: <Home size={20} color="white" />,
    },
    {
      title: "Total Revenue",
      count: dashboardData?.totalRevenue
        ? formatCurrency(dashboardData.totalRevenue)
        : "$0",
      color: "bg-yellow-400",
      icon: <IndianRupeeIcon size={20} color="white" />,
    },
    {
      title: "Bookings",
      count: dashboardData?.bookings || 0,
      color: "bg-indigo-800",
      icon: <Calendar size={20} color="white" />,
    },
  ];

  // Distribution data for pie chart
  const distributionData = [
    { name: "Bookings", value: dashboardData?.bookings || 0 },
    { name: "Hostels", value: dashboardData?.hostels || 0 },
    { name: "Users", value: dashboardData?.users || 0 },
  ];

  return (
    <div className=" flex h-auto min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Provider Dashboard
            </h1>
            <div
              className="flex items-center cursor-pointer bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              onClick={() => navigate("/provider/profile")}
            >
              <span className="mr-2 text-gray-800 hidden sm:inline font-medium">
                {profile.fullName}
              </span>
              <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center">
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
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {isDashboardLoading ? (
                  <div className="col-span-2 lg:col-span-4 flex justify-center items-center py-8">
                    <Loading text="Loading dashboard" color="#FFB300" />
                  </div>
                ) : (
                  metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div
                        className={`${metric.color} w-12 h-12 rounded-full flex items-center justify-center shadow-md mr-4`}
                      >
                        {metric.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          {metric.title}
                        </div>
                        <div className="text-xl lg:text-2xl font-bold">
                          {metric.count}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Charts Section */}
            {!isDashboardLoading && dashboardData?.revenueData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <RevenueAnalytics revenueData={dashboardData.revenueData} />
                <DistributionChart data={distributionData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
