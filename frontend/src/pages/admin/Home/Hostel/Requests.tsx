import { verifyHostel } from "@/services/Api/admin/adminApi";
import { Eye, MapPin, Users, Bed, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/global/Loading";
import { useState } from "react";
import { HostelDetailsDialog } from "@/pages/admin/Home/Hostel/components/HostelDetailsDialog";
import { useUnverifiedHostels } from "@/hooks/admin/useAdminQueries";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

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

export const Requests: React.FC = () => {
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Add new state for confirmation modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: hostels = [],
    isLoading,
    error,
    refetch,
  } = useUnverifiedHostels();

  // Updated verification handler
  const handleVerification = async (isVerified: boolean) => {
    // Set the action type and show confirmation modal
    setConfirmAction(isVerified ? "approve" : "reject");
    setIsConfirmModalOpen(true);
    setIsDialogOpen(false); // Close the details dialog
  };

  // Handle confirmation
  const handleConfirmAction = async () => {
    if (!selectedHostel || !confirmAction) return;

    setIsProcessing(true);

    try {
      if (confirmAction === "approve") {
        await verifyHostel(selectedHostel._id, "", true, false);
        toast.success("Hostel approved successfully");
      } else {
        // For rejection, show the reason modal instead
        setIsConfirmModalOpen(false);
        setTimeout(() => {
          setIsRejectModalOpen(true);
        }, 100);
        setIsProcessing(false);
        return;
      }

      refetch();
      setIsConfirmModalOpen(false);
    } catch (error) {
      toast.error(`Failed to ${confirmAction} hostel`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle rejection with reason
  const handleRejection = async () => {
    try {
      if (!selectedHostel) return;

      if (!rejectionReason.trim()) {
        toast.error("Please provide a reason for rejection");
        return;
      }

      setIsProcessing(true);
      await verifyHostel(selectedHostel._id, rejectionReason, false, false);
      toast.success("Hostel rejected successfully");

      // Reset and close modals
      setRejectionReason("");
      setIsRejectModalOpen(false);
      setIsConfirmModalOpen(false); // Also close confirmation modal
      setConfirmAction(null); // Reset action
      refetch();
    } catch (error) {
      toast.error("Failed to reject hostel");
    } finally {
      setIsProcessing(false);
    }
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    if (!isProcessing) {
      setIsConfirmModalOpen(false);
      setConfirmAction(null);
    }
  };

  // Close rejection modal
  const closeRejectionModal = () => {
    if (!isProcessing) {
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setIsConfirmModalOpen(false);
      setConfirmAction(null);
    }
  };

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
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const HostelCard: React.FC<{ hostel: Hostel }> = ({ hostel }) => (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-[#2A2B2F] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-700"
    >
      <div className="relative h-48">
        <img
          src={hostel.photos[0]}
          alt={hostel.hostel_name}
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-2 right-2 bg-amber-500/80 text-white px-3 py-1 rounded-full text-sm font-medium"
        >
          ${hostel.monthly_rent}/month
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2">
          {hostel.hostel_name}
        </h3>
        <div className="text-sm text-gray-400 space-y-2">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-amber-500" />
            <span>Location: {hostel.location.address}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-amber-500" />
            <span>Provider: {hostel.provider_id.fullName}</span>
          </div>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-2 text-amber-500" />
            <span>Gender: {hostel.gender}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedHostel(hostel);
            setIsDialogOpen(true);
          }}
          className="mt-4 flex items-center px-4 py-2 bg-[#242529] text-amber-500 rounded-lg hover:bg-[#1e1f22] transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </motion.button>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex bg-[#242529] justify-center items-center min-h-screen">
        <Loading
          text="Loading requests..."
          color="#6366f1"
          className="text-white"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading pending requests
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-[#242529] min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Pending Hostel Requests
          </h1>
          <p className="text-gray-400 mt-2">
            Review and verify new hostel submissions
          </p>
        </div>
        <div className="text-sm text-amber-500 font-medium">
          {hostels?.length} pending{" "}
          {hostels?.length === 1 ? "request" : "requests"}
        </div>
      </motion.div>

      <AnimatePresence>
        {hostels?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-gray-400"
          >
            No pending requests available
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {hostels?.map((hostel: Hostel) => (
              <HostelCard key={hostel._id} hostel={hostel} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only render the details dialog if rejection modal is not open */}
      {!isRejectModalOpen && (
        <HostelDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          selectedHostel={selectedHostel as any}
          onVerify={handleVerification}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={confirmAction === "approve" ? "Approve Hostel" : "Reject Hostel"}
        message={
          confirmAction === "approve"
            ? `Are you sure you want to approve "${selectedHostel?.hostel_name}"? This will make the hostel visible to users and the provider will be notified.`
            : `Are you sure you want to reject "${selectedHostel?.hostel_name}"? You will be asked to provide a reason for rejection.`
        }
        type={confirmAction || "approve"}
        isLoading={isProcessing}
      />

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#2A2B2F] rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Reject: {selectedHostel?.hostel_name}
                </h3>
                <button
                  onClick={closeRejectionModal}
                  className="text-gray-400 hover:text-white"
                  disabled={isProcessing}
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-300 mb-4">
                Please provide a reason for rejecting this hostel request. This
                will be visible to the provider.
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full bg-[#1e1f22] text-white border border-gray-700 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                autoFocus
                disabled={isProcessing}
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={closeRejectionModal}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors flex-1 disabled:opacity-50"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejection}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Rejecting..." : "Reject Hostel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
