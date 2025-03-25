import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getHostelById } from "@/services/Api/adminApi";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Users,
  Bed,
  IndianRupee,
  Shield,
  Info,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Tv,
  ParkingCircle,
  Coffee,
  UtensilsCrossed,
  Fan,
  Fingerprint,
  Sofa,
  Bath,
  Dumbbell,
  User,
} from "lucide-react";
import Loading from "@/components/global/Loading";

const getAmenityIcon = (amenity: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    WiFi: <Wifi className="w-4 h-4" />,
    TV: <Tv className="w-4 h-4" />,
    Parking: <ParkingCircle className="w-4 h-4" />,
    Kitchen: <UtensilsCrossed className="w-4 h-4" />,
    "Coffee Maker": <Coffee className="w-4 h-4" />,
    Fan: <Fan className="w-4 h-4" />,
    Security: <Fingerprint className="w-4 h-4" />,
    Furniture: <Sofa className="w-4 h-4" />,
    Bathroom: <Bath className="w-4 h-4" />,
    Gym: <Dumbbell className="w-4 h-4" />,
  };

  return iconMap[amenity] || <CheckCircle2 className="w-4 h-4" />;
};

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: hostelData, isLoading } = useQuery({
    queryKey: ["hostel", id],
    queryFn: async () => {
      const response = await getHostelById(id as string);
      return response;
    },
  });

  const hostel = hostelData;

  if (isLoading) {
    return (
      <div className="flex bg-[#242529] justify-center items-center min-h-screen">
        <Loading
          text="Loading details..."
          color="#6366f1"
          className="text-white"
        />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Hostel not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#242529] min-h-screen">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-300 mb-6 hover:text-white"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to List
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2A2B2F] rounded-xl shadow-lg overflow-hidden border border-gray-700"
      >
        {/* Header Section */}
        <div className="border-b border-gray-700 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
    <div>
              <h1 className="text-3xl font-bold text-white">
                {hostel.hostel_name}
              </h1>
              <div className="flex items-center text-gray-300 mt-2">
                <MapPin className="w-5 h-5 mr-2 text-amber-500" />
                <span className="text-lg">{hostel.location.address}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-lg flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Verified Property
              </div>
              <div className="bg-blue-900/30 text-blue-400 px-4 py-2 rounded-lg flex items-center">
                <Users className="w-5 h-5 mr-2" />
                For {hostel.gender}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Images and Key Details */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-96 rounded-xl overflow-hidden shadow-md">
                <img
                  src={hostel.photos[0]}
                  alt={hostel.hostel_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {hostel.photos.slice(1).map((photo: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={photo}
                      alt={`${hostel.hostel_name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Simplified Key Information Cards */}
            <motion.div className="grid grid-cols-2 gap-4">
              <div className="bg-[#242529] p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm font-medium mb-2">
                  Monthly Rent
                </p>
                <p className="text-2xl font-bold text-white flex items-center">
                  <IndianRupee className="w-6 h-6 mr-1 text-amber-500" />
                  {hostel.monthly_rent}
                </p>
              </div>
              <div className="bg-[#242529] p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm font-medium mb-2">
                  Security Deposit
                </p>
                <p className="text-2xl font-bold text-white flex items-center">
                  <IndianRupee className="w-6 h-6 mr-1 text-amber-500" />
                  {hostel.deposit_amount}
                </p>
              </div>
            </motion.div>

            {/* Simplified Occupancy Status */}
            <motion.div className="bg-[#242529] p-6 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Bed className="w-5 h-5 mr-2 text-amber-500" />
                Occupancy Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2A2B2F] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Available Beds</p>
                  <p className="text-xl font-bold text-white">
                    {hostel.available_space} / {hostel.total_space}
                  </p>
                </div>
                <div className="bg-[#2A2B2F] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Maximum Occupancy</p>
                  <p className="text-xl font-bold text-white">
                    {hostel.maximum_occupancy}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="space-y-6">
            {/* Provider Information */}
            <motion.div className="bg-[#2A2B2F] p-6 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                Provider Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center bg-[#242529] p-3 rounded-lg">
                  <User className="w-5 h-5 mr-3 text-blue-400" />
                  <span className="text-gray-300">
                    {hostel.provider_id.fullName}
                  </span>
                </div>
                <div className="flex items-center bg-[#242529] p-3 rounded-lg">
                  <Mail className="w-5 h-5 mr-3 text-blue-400" />
                  <span className="text-gray-300">
                    {hostel.provider_id.email}
                  </span>
                </div>
                {hostel.provider_id.phone && (
                  <div className="flex items-center bg-[#242529] p-3 rounded-lg">
                    <Phone className="w-5 h-5 mr-3 text-green-400" />
                    <span className="text-gray-300">
                      {hostel.provider_id.phone}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Simplified Description */}
            <motion.div className="bg-[#242529] p-6 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-amber-500" />
                About this Property
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {hostel.description}
              </p>
            </motion.div>

            {/* Simplified Rules */}
            {hostel.rules && (
              <motion.div className="bg-[#242529] p-6 rounded-xl border border-gray-700">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                  House Rules
                </h3>
                <p className="text-gray-300 leading-relaxed">{hostel.rules}</p>
              </motion.div>
            )}

            {/* Combined Facilities and Amenities */}
            <motion.div className="space-y-6">
              {/* Facilities */}
              {hostel.facilities && hostel.facilities.length > 0 && (
                <div className="bg-[#242529] p-6 rounded-xl border border-gray-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-amber-500" />
                    Available Facilities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {hostel.facilities.map((facility: any) => (
                      <div
                        key={facility._id}
                        className="bg-[#2A2B2F] px-4 py-3 rounded-lg flex items-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        <span className="text-gray-300 text-sm">
                          {facility.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities with Icons */}
              {hostel.amenities && hostel.amenities.length > 0 && (
                <div className="bg-[#242529] p-6 rounded-xl border border-gray-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-amber-500" />
                    Additional Amenities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {hostel.amenities.map((amenity: string, index: number) => (
                      <div
                        key={index}
                        className="bg-[#2A2B2F] px-4 py-3 rounded-lg flex items-center space-x-2"
                      >
                        <span className="text-amber-500">
                          {getAmenityIcon(amenity)}
                        </span>
                        <span className="text-gray-300 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccommodationDetails;
