import { useNavigate } from "react-router-dom";
import { Eye, MapPin, Users, Bed } from "lucide-react";
import { motion } from "framer-motion";
import Loading from "@/components/global/Loading";
import { useVerifiedHostels } from "@/hooks/admin/useAdminQueries";

interface Hostel {
  _id: string;
  hostel_name: string;
  monthly_rent: number;
  deposit_amount: number;
  gender: string;
  photos: string[];
  location: {
    address: string;
  };
  provider_id: {
    fullName: string;
    email: string;
  };
  description: string;
  maximum_occupancy: number;
  total_space: number;
  available_space: number;
}

const HostelsList = () => {
  const navigate = useNavigate();

  const { data: hostels = [], isLoading } = useVerifiedHostels();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex bg-[#242529] justify-center items-center min-h-screen">
        <Loading
          text="Loading hostels..."
          color="#6366f1"
          className="text-white"
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#242529] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">
          Verified Accommodations
        </h1>
        <p className="text-gray-400 mt-2">
          List of all verified hostels in the platform
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {hostels.map((hostel: Hostel) => (
          <motion.div
            key={hostel._id}
            variants={cardVariants}
            className="bg-[#2A2B2F] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-700"
          >
            <div className="relative h-48">
              <img
                src={hostel.photos[0]}
                alt={hostel.hostel_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                Verified
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-semibold text-white mb-2">
                {hostel.hostel_name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm truncate">
                    {hostel.location.address}
                  </span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm">For {hostel.gender}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Bed className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm">
                    {hostel.available_space} of {hostel.total_space} beds
                    available
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-amber-500 font-semibold">
                  ${hostel.monthly_rent}/month
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigate(`/admin/accommodations/${hostel._id}`)
                  }
                  className="flex items-center px-4 py-2 bg-[#242529] text-amber-500 rounded-lg hover:bg-[#1e1f22] transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {hostels.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-400"
        >
          No verified accommodations found
        </motion.div>
      )}
    </div>
  );
};

export default HostelsList;
