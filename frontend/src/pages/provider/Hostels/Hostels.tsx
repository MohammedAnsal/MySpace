import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHostel } from "@/services/Api/providerApi";
import { verifyHostel } from "@/services/Api/admin/adminApi";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Bed,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/global/Loading";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import ViewHostel from "./components/ViewHostel";
import { useProviderHostels } from "@/hooks/provider/hostel/useHostel";
import { Hostel } from "@/types/api.types";

const ITEMS_PER_PAGE = 4;

const Hostels = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hostelToDelete, setHostelToDelete] = useState<string | null>(null);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [reapplyLoading, setReapplyLoading] = useState<string | null>(null);

  const { data: hostels = [], isLoading, error } = useProviderHostels();

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteHostel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-hostels"] });
      toast.success("Hostel deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete hostel");
    },
  });

  const reapplyMutation = useMutation({
    mutationFn: (params: {
      hostelId: string;
      reason: string;
      isVerified: boolean;
      isRejected: boolean;
    }) =>
      verifyHostel(
        params.hostelId,
        params.reason,
        params.isVerified,
        params.isRejected
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-hostels"] });
      toast.success("Hostel resubmitted for verification");
      setReapplyLoading(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resubmit hostel");
      setReapplyLoading(null);
    },
  });

  const filteredHostels = hostels.filter(
    (hostel: Hostel) =>
      hostel.hostel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredHostels.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHostels = filteredHostels.slice(startIndex, endIndex);

  const handleDeleteHostel = (hostelId: string) => {
    setHostelToDelete(hostelId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (hostelToDelete) {
      deleteMutation.mutate(hostelToDelete);
      setIsDeleteModalOpen(false);
      setHostelToDelete(null);
    }
  };

  const handleViewHostel = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setIsViewModalOpen(true);
  };

  const handleReapply = (hostelId: string) => {
    setReapplyLoading(hostelId);
    reapplyMutation.mutate({
      hostelId,
      reason: "",
      isVerified: false,
      isRejected:true
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-red-500">
          Failed to load hostels. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Hostels</h1>
              <p className="text-gray-600 mt-1">
                Manage your listed properties and rooms
              </p>
            </div>
            <button
              onClick={() => navigate("/provider/hostel/add")}
              className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loading text="loading properties..." color="#FFB300" />
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentHostels.map((hostel: Hostel) => (
                <motion.div
                  key={hostel._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-48">
                    <img
                      src={hostel.photos[0]}
                      alt={hostel.hostel_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-semibold">
                        ${hostel.monthly_rent}/month
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          hostel.is_verified
                            ? "bg-green-500/90 text-white"
                            : hostel.is_rejected
                            ? "bg-red-500/90 text-white"
                            : "bg-yellow-500/90 text-white"
                        }`}
                      >
                        {hostel.is_verified
                          ? "Verified"
                          : hostel.is_rejected
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {hostel.hostel_name}
                    </h3>

                    {hostel.is_rejected && hostel.reason && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-md">
                        <div className="flex gap-2">
                          <AlertTriangle className="text-red-500 flex-shrink-0 w-4 h-4 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-red-700">
                              Rejection Reason:
                            </p>
                            <p className="text-xs text-gray-700 mt-1">
                              {hostel.reason}
                            </p>

                            <button
                              onClick={() => handleReapply(hostel._id)}
                              disabled={reapplyLoading === hostel._id}
                              className="mt-2 flex items-center text-xs bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded transition-colors"
                            >
                              {reapplyLoading === hostel._id ? (
                                <Loading color="#ffffff" className="mr-1" />
                              ) : (
                                <RefreshCw className="w-3 h-3 mr-1" />
                              )}
                              Reapply for Verification
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                        <span className="text-sm truncate">
                          {hostel.location.address}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-amber-500" />
                        <span className="text-sm">For {hostel.gender}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Bed className="w-4 h-4 mr-2 text-amber-500" />
                        <span className="text-sm">
                          {hostel.available_space} of {hostel.total_space} beds
                          available
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewHostel(hostel)}
                        className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/provider/hostel/edit/${hostel._id}`)
                        }
                        className="p-2 text-gray-600 hover:text-amber-500 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHostel(hostel._id)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && currentHostels.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Hostels Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first property
                </p>
                <button
                  onClick={() => navigate("/provider/hostel/add")}
                  className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Property
                </button>
              </div>
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-amber-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}

          {!isLoading && totalItems > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems} properties
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setHostelToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Hostel"
        message="Are you sure you want to delete this hostel? This action cannot be undone and all associated data will be permanently removed."
      />

      {isViewModalOpen && selectedHostel && (
        <ViewHostel
          hostel={selectedHostel}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedHostel(null);
          }}
          onReapply={handleReapply}
        />
      )}
    </>
  );
};

export default Hostels;
