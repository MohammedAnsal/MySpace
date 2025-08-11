import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Coins,
  Wallet,
  Users,
  UserPlus,
  MapPin,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Home,
  FileText,
  Eye,
} from "lucide-react";
import { useState } from "react";

interface Hostel {
  _id: string;
  hostel_name: string;
  monthly_rent: number;
  deposit_amount: number;
  gender: string;
  photos: string[];
  property_proof?: string; // Add this
  location: {
    address: string;
  };
  provider_id: {
    fullName: string;
    email: string;
    phone: number;
  };
  description: string;
  maximum_occupancy: number;
  total_space: number;
  rules?: string;
  deposit_terms?: string[];
  amenities?: string[];
  facilities?: Array<{
    _id: string;
    name: string;
    provider_id?: string;
    price?: number;
    status?: boolean;
    description?: string;
  }>;
}

interface HostelDetailsDialogProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  selectedHostel: Hostel | null;
  onVerify: (hostelId: string, isVerified: boolean) => void;
}

// Helper component for consistent detail items
const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span className="text-gray-400">{label}:</span>
    <span className="text-white">{value}</span>
  </div>
);

export const HostelDetailsDialog: React.FC<HostelDetailsDialogProps> = ({
  isOpen,
  onClose,
  selectedHostel,
  onVerify,
}) => {
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose} >
          <DialogContent className="max-w-5xl bg-[#2A2B2F] border border-gray-700 text-white overflow-y-auto max-h-[90vh] scrollbar-hide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  Hostel Details
                </DialogTitle>
              </DialogHeader>

              {selectedHostel && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Images Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <motion.div className="relative h-64 rounded-lg overflow-hidden">
                        <img
                          src={selectedHostel.photos[0]}
                          alt={selectedHostel.hostel_name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <motion.div
                        className="grid grid-cols-4 gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {selectedHostel.photos.slice(1, 5).map((photo, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative h-20 rounded-lg overflow-hidden"
                          >
                            <img
                              src={photo}
                              alt={`${selectedHostel.hostel_name} ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Description */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-[#242529] p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-medium text-amber-500 mb-2">
                          Description
                        </h3>
                        <p className="text-gray-300">
                          {selectedHostel.description}
                        </p>
                      </motion.div>

                      {/* Property License */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65 }}
                        className="bg-[#242529] p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-medium text-amber-500 mb-2 flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          Property License
                        </h3>
                        
                        {selectedHostel.property_proof ? (
                          <div className="relative">
                            <img
                              src={selectedHostel?.property_proof as string}
                              alt="Property License"
                              className="w-64 h-48 object-cover rounded-lg border border-gray-600"
                            />
                            <button
                              onClick={() => setShowLicenseModal(true)}
                              className="absolute top-2 right-2 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-64 h-48 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                            <div className="text-center">
                              <FileText size={48} className="text-gray-500 mx-auto mb-2" />
                              <p className="text-gray-400 text-sm">No license document uploaded</p>
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Rules and Terms */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#242529] p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-medium text-amber-500 mb-2">
                          Rules and Terms
                        </h3>
                        <div className="space-y-3">
                          {selectedHostel.rules && (
                            <div className="space-y-1">
                              <label className="text-sm text-gray-400">
                                House Rules:
                              </label>
                              <p className="text-gray-300">
                                {selectedHostel.rules}
                              </p>
                            </div>
                          )}
                          {selectedHostel.deposit_terms && (
                            <div className="space-y-1">
                              <label className="text-sm text-gray-400">
                                Deposit Terms:
                              </label>
                              <ul className="list-disc list-inside text-gray-300">
                                {selectedHostel.deposit_terms.map(
                                  (term, index) => (
                                    <li key={index}>{term}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">
                          {selectedHostel.hostel_name}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <DetailItem
                            icon={<Coins className="w-4 h-4 text-amber-500" />}
                            label="Monthly Rent"
                            value={`$${selectedHostel.monthly_rent}`}
                          />
                          <DetailItem
                            icon={<Wallet className="w-4 h-4 text-amber-500" />}
                            label="Deposit"
                            value={`$${selectedHostel.deposit_amount}`}
                          />
                          <DetailItem
                            icon={<Users className="w-4 h-4 text-amber-500" />}
                            label="Gender"
                            value={selectedHostel.gender}
                          />
                          <DetailItem
                            icon={<UserPlus className="w-4 h-4 text-amber-500" />}
                            label="Maximum Occupancy"
                            value={selectedHostel.maximum_occupancy}
                          />
                          <DetailItem
                            icon={<Home className="w-4 h-4 text-amber-500" />}
                            label="Total Space"
                            value={`${selectedHostel.total_space}`}
                          />
                          <DetailItem
                            icon={<MapPin className="w-4 h-4 text-amber-500" />}
                            label="Location"
                            value={selectedHostel.location.address}
                          />
                        </div>
                      </div>

                      {/* Provider Information */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#242529] p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-medium text-amber-500 mb-2">
                          Provider Details
                        </h3>
                        <div className="space-y-2">
                          <DetailItem
                            icon={<User className="w-4 h-4 text-amber-500" />}
                            label="Name"
                            value={selectedHostel.provider_id.fullName}
                          />
                          <DetailItem
                            icon={<User className="w-4 h-4 text-amber-500" />}
                            label="Phone"
                            value={selectedHostel.provider_id.phone}
                          />
                          <DetailItem
                            icon={<Mail className="w-4 h-4 text-amber-500" />}
                            label="Email"
                            value={selectedHostel.provider_id.email}
                          />
                        </div>
                      </motion.div>

                      {/* Amenities and Facilities */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {selectedHostel.amenities && (
                          <div className="bg-[#242529] p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-amber-500 mb-2">
                              Amenities
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedHostel.amenities.map((amenity, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedHostel.facilities && (
                          <div className="bg-[#242529] p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-amber-500 mb-2">
                              Facilities
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedHostel.facilities.map((facility) => (
                                <span
                                  key={facility._id}
                                  className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
                                >
                                  {facility.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex gap-3 mt-6"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onVerify(selectedHostel._id, true)}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 border border-green-600/30"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onVerify(selectedHostel._id, false)}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 border border-red-600/30"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
      {/* License Image Modal */}
      {showLicenseModal && selectedHostel?.property_proof && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-[70] flex items-center justify-center p-4"
          onClick={() => setShowLicenseModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl max-h-[90vh] bg-[#2A2B2F] rounded-lg overflow-hidden border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLicenseModal(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <XCircle size={24} />
            </button>
            <img
              src={selectedHostel.property_proof}
              alt="Property License - Full View"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
