import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Check, X } from "lucide-react";
import { useAdminFacilities } from "@/hooks/admin/useAdminFacilities";
import Loading from "@/components/global/Loading";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";

const ALLOWED_FACILITIES = [
  "Catering Service",
  "Deep Cleaning Service",
  "Laundry Service",
];

export const AdminManageFacilities: React.FC = () => {
  const {
    facilities,
    isLoading,
    error,
    addFacility,
    isCreating,
    updateStatus,
    removeFacility,
  } = useAdminFacilities();
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityPrice, setNewFacilityPrice] = useState("");
  const [newFacilityDescription, setNewFacilityDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<string | null>(null);
  const [validationError, setValidationError] = useState("");
  const [canAddMore, setCanAddMore] = useState(true);

  useEffect(() => {
    if (facilities) {
      const existingFacilityNames = facilities.map(
        (f: { name: any }) => f.name
      );
      const allAllowedAdded = ALLOWED_FACILITIES.every((facility) =>
        existingFacilityNames.includes(facility)
      );
      setCanAddMore(!allAllowedAdded);
    }
  }, [facilities]);

  const handleToggleFacility = (id: string, currentStatus: boolean) => {
    updateStatus(
      { facilityId: id, status: !currentStatus },
      {
        onSuccess: () => {
          setSuccessMessage(
            `Facility ${currentStatus ? "blocked" : "activated"} successfully!`
          );
          setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error) => {
          console.error("Error updating facility status:", error);
        },
      }
    );
  };

  const handleAddFacility = async () => {
    try {
      setValidationError("");

      if (!newFacilityName.trim()) {
        setValidationError("Facility name is required");
        return;
      }
      if (!newFacilityPrice || parseFloat(newFacilityPrice) <= 0) {
        setValidationError("Valid price is required");
        return;
      }
      if (!newFacilityDescription.trim()) {
        setValidationError("Description is required");
        return;
      }

      if (!ALLOWED_FACILITIES.includes(newFacilityName.trim())) {
        setValidationError(
          "Only specific facilities are allowed: Catering Service, Deep Cleaning Service, Laundry Service"
        );
        return;
      }

      const facilityExists = facilities.some(
        (f: { name: string }) =>
          f.name.toLowerCase() === newFacilityName.trim().toLowerCase()
      );
      if (facilityExists) {
        setValidationError("This facility already exists");
        return;
      }

      const facilityData = {
        name: newFacilityName.trim(),
        price: newFacilityPrice,
        description: newFacilityDescription.trim(),
        status: true,
      };

      addFacility(facilityData, {
        onSuccess: () => {
          setNewFacilityName("");
          setNewFacilityPrice("");
          setNewFacilityDescription("");
          setSuccessMessage("Facility added successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error) => {
          console.error("Error adding facility:", error);
          setValidationError("Failed to add facility. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error:", error);
      setValidationError("An unexpected error occurred");
    }
  };

  const handleRemoveFacility = (id: string) => {
    setFacilityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (facilityToDelete) {
      removeFacility(facilityToDelete, {
        onSuccess: () => {
          setSuccessMessage("Facility deleted successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error) => {
          console.error("Error deleting facility:", error);
        },
      });
    }
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex bg-[#242529] justify-center items-center min-h-screen">
        <Loading
          text="Loading facilities..."
          color="#6366f1"
          className="text-white"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 text-red-400 rounded-lg">
        Error loading facilities. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen bg-[#242529] pb-8">
        <div className="p-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-white mb-2">
              Manage Global Facilities
            </h1>
            <p className="text-gray-400">
              Add, update, or remove global facilities for hostels
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Add Facility Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#2A2B2F] rounded-xl shadow-lg p-6 border border-gray-700 lg:w-1/2"
            >
              <h2 className="text-xl font-medium mb-4 text-white flex items-center">
                <Plus className="mr-2 text-amber-500" size={20} />
                Add New Facility
              </h2>

              {!canAddMore && (
                <div className="mb-4 p-3 bg-yellow-900/30 text-yellow-400 rounded-lg text-sm">
                  All allowed facilities have been added. No more facilities can
                  be added.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    value={newFacilityName}
                    onChange={(e) => setNewFacilityName(e.target.value)}
                    placeholder="Facility name"
                    className="px-4 py-3 bg-[#242529] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#C8ED4F] focus:border-[#C8ED4F] outline-none w-full"
                    disabled={!canAddMore}
                  />
                  <div className="mt-1 text-sm text-gray-400">
                    Allowed facilities: Catering Service, Deep Cleaning Service,
                    Laundry Service
                  </div>
                </div>
                <input
                  type="number"
                  value={newFacilityPrice}
                  onChange={(e) => setNewFacilityPrice(e.target.value)}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  className="px-4 py-3 bg-[#242529] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#C8ED4F] focus:border-[#C8ED4F] outline-none"
                  disabled={!canAddMore}
                />
                <textarea
                  value={newFacilityDescription}
                  onChange={(e) => setNewFacilityDescription(e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="px-4 py-3 bg-[#242529] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#C8ED4F] focus:border-[#C8ED4F] outline-none resize-none"
                  disabled={!canAddMore}
                />
                {validationError && (
                  <div className="text-red-400 text-sm">{validationError}</div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddFacility}
                  disabled={isCreating || !canAddMore}
                  className="px-4 py-3 bg-[#C8ED4F] text-gray-900 font-semibold rounded-lg hover:bg-[#b8dd3f] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  ) : (
                    <Plus size={20} className="mr-2" />
                  )}
                  Add Facility
                </motion.button>
              </div>
            </motion.div>

            {/* Facilities List Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#2A2B2F] rounded-xl shadow-lg p-6 border border-gray-700 lg:w-1/2"
            >
              <h2 className="text-xl font-medium mb-4 text-white">
                All Facilities
              </h2>

              {facilities.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No facilities added yet. Create your first facility.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {facilities.map((facility: any) => (
                    <motion.div
                      key={facility._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-wrap items-start justify-between p-3 border border-gray-700 rounded-lg hover:border-[#C8ED4F]/50 transition-colors bg-[#242529]"
                    >
                      <div className="flex items-start flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={facility.status}
                          onChange={() =>
                            handleToggleFacility(facility._id, facility.status)
                          }
                          className="mr-3 h-5 w-5 accent-[#C8ED4F] mt-1"
                        />
                        <div className="flex flex-col">
                          <span
                            className={
                              facility.status
                                ? "text-white font-medium"
                                : "text-gray-400 line-through"
                            }
                          >
                            {facility.name}
                          </span>
                          <span className="text-sm text-[#C8ED4F] font-semibold">
                            ${facility.price}
                          </span>
                          <p className="text-sm text-gray-400 mt-1">
                            {facility.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0 space-x-2">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${facility._id}-${facility.status}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              facility.status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {facility.status ? "Active" : "Blocked"}
                          </motion.span>
                        </AnimatePresence>
                        <button
                          onClick={() =>
                            handleToggleFacility(facility._id, facility.status)
                          }
                          className={`px-2 py-1 rounded-lg text-white font-semibold transition-all duration-200 flex items-center text-xs ${
                            facility.status
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {facility.status ? (
                            <>
                              <X size={12} className="mr-1" /> Block
                            </>
                          ) : (
                            <>
                              <Check size={12} className="mr-1" /> Unblock
                            </>
                          )}
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveFacility(facility._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 bg-red-900/20 rounded-full"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFacilityToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Facility"
        message="Are you sure you want to delete this facility? This action cannot be undone."
      />
    </>
  );
};

export default AdminManageFacilities;
