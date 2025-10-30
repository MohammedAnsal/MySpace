import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  MapPin,
  Users,
  Bed,
  Wifi,
  DollarSign,
  Home,
  Shield,
  Clock,
  Calendar,
  CheckCircle,
  Car,
  AirVent,
  CookingPot,
  WashingMachine,
  Cctv,
  GlassWaterIcon,
  AlertTriangle,
  FileText,
  Eye,
} from "lucide-react";

interface ViewHostelProps {
  hostel: any;
  onClose: () => void;
  onReapply: (hostelId: string) => void;
}

const ViewHostel: React.FC<ViewHostelProps> = ({ hostel, onClose }) => {
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  if (!hostel) return null;

  // Map amenity names to icons
  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: JSX.Element } = {
      Wifi: <Wifi className="w-5 h-5" />,
      Parking: <Car className="w-5 h-5" />,
      Kitchen: <CookingPot className="w-5 h-5" />,
      Laundry: <WashingMachine className="w-5 h-5" />,
      Cctv: <Cctv className="w-5 h-5" />,
      "Water filter": <GlassWaterIcon className="w-5 h-5" />,
      "Air Conditioning": <AirVent className="w-5 h-5" />,
    };
    return icons[amenity] || <CheckCircle className="w-5 h-5" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/90">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {hostel.hostel_name}
              </h2>
              <p className="text-gray-500 flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {hostel.location.address}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>

          {hostel.is_rejected && hostel.reason && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-700">Hostel Rejected</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Reason: </span>
                    {hostel.reason}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Please address these issues and resubmit your hostel for
                    verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {hostel.photos.map((photo: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                >
                  <img
                    src={photo}
                    alt={`${hostel.hostel_name} - ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Key Information Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-500 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600">Monthly Rent</p>
                    <p className="text-2xl font-bold text-amber-600">
                      ₹{hostel.monthly_rent}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600">For</p>
                    <p className="text-2xl font-bold text-blue-600 capitalize">
                      {hostel.gender}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Bed className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600">Availability</p>
                    <p className="text-2xl font-bold text-green-600">
                      {hostel.available_space}/{hostel.total_space}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-gray-600" />
                About this Hostel
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {hostel.description}
              </p>
            </motion.div>

            {/* Property License / Verification Document */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="bg-gray-50 p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Property License
              </h3>

              {hostel.property_proof ? (
                <div className="relative">
                  <img
                    src={hostel.property_proof}
                    alt="Property License"
                    className="w-64 h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => setShowLicenseModal(true)}
                    className="absolute top-2 right-2 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-64 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <FileText
                      size={48}
                      className="text-gray-400 mx-auto mb-2"
                    />
                    <p className="text-gray-500 text-sm">
                      No license document uploaded
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-gray-600" />
                Amenities & Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hostel.amenities.map((amenity: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="text-amber-500">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Facilities Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Home className="w-5 h-5 mr-2 text-gray-600" />
                Available Facilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostel.facilities.map((facility: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {facility.name}
                        </h4>
                        {facility.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {facility.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              facility.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {facility.status ? "Available" : "Not Available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Rules and Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  House Rules
                </h3>
                <div className="space-y-2 text-gray-600">
                  {hostel.rules
                    .split("\n")
                    .map((rule: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p>{rule}</p>
                      </div>
                    ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  Deposit Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-600">Deposit Amount</p>
                    <p className="text-xl font-semibold text-amber-600">
                      ₹{hostel.deposit_amount}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-600">Terms</p>
                    <p className="text-gray-800">{hostel.deposit_terms}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* License Image Modal */}
        {showLicenseModal && hostel.property_proof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowLicenseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLicenseModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <IoClose size={24} />
              </button>
              <img
                src={hostel.property_proof}
                alt="Property License - Full View"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewHostel;
