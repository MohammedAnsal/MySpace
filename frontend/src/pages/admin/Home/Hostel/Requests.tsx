import { verifyHostel } from "@/services/Api/admin/adminApi";
import { Eye, MapPin, Users, Bed } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/global/Loading";
import { useState } from "react";
import { HostelDetailsDialog } from "@/components/admin/HostelDetailsDialog";
import { useUnverifiedHostels } from "@/hooks/admin/useAdminQueries";

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

  const { data: hostels = [], isLoading, error, refetch } = useUnverifiedHostels();

  const handleVerification = async (hostelId: string, isVerified: boolean) => {
    try {
      await verifyHostel(hostelId, isVerified);
      toast.success(
        isVerified
          ? "Hostel approved successfully"
          : "Hostel rejected successfully"
      );
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to process hostel verification");
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

      <HostelDetailsDialog
        isOpen={isDialogOpen}
        onClose={setIsDialogOpen}
        selectedHostel={selectedHostel as any} // Type assertion to temporarily fix type mismatch
        onVerify={handleVerification}
      />
    </motion.div>
  );
};
