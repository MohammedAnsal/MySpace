import React, { useState } from "react";
import { Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { useFacilities } from "@/hooks/useFacilities";
import Loading from "@/components/global/Loading";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

export const ManageFacilities: React.FC = () => {
  const {
    facilities,
    isLoading,
    error,
    addFacility,
    isCreating,
    updateStatus,
    removeFacility,
  } = useFacilities();
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityPrice, setNewFacilityPrice] = useState("");
  const [newFacilityDescription, setNewFacilityDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<string | null>(null);

  const handleToggleFacility = (id: string, currentStatus: boolean) => {
    updateStatus(
      { facilityId: id, status: !currentStatus },
      {
        onSuccess: () => {
          setSuccessMessage("Facility status updated successfully!");
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
      if (!newFacilityName.trim()) {
        return;
      }
      if (!newFacilityPrice || parseFloat(newFacilityPrice) <= 0) {
        return;
      }
      if (!newFacilityDescription.trim()) {
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
        },
      });
    } catch (error) {
      console.error("Error:", error);
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block mb-4">
            <Loading color="#FFB300" text="Loading your facilities..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading facilities</div>;
  }

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 pb-8">
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-semibold mb-2 sm:mb-0 text-gray-800">
              Manage Hostel Facilities
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-amber-100 mb-6">
            <h2 className="text-xl font-medium mb-4 text-gray-800">
              Add New Facility
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <input
                type="text"
                value={newFacilityName}
                onChange={(e) => setNewFacilityName(e.target.value)}
                placeholder="Facility name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
              />
              <input
                type="number"
                value={newFacilityPrice}
                onChange={(e) => setNewFacilityPrice(e.target.value)}
                placeholder="Price"
                min="0"
                step="0.01"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none"
              />
              <textarea
                value={newFacilityDescription}
                onChange={(e) => setNewFacilityDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none resize-none"
              />
              <button
                onClick={handleAddFacility}
                className="px-4 py-2 bg-amber-400 text-gray-800 rounded-lg hover:bg-amber-500 transition-colors flex items-center justify-center"
              >
                {isCreating ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Plus size={20} className="mr-1" />
                )}
                Add Facility
              </button>
            </div>

            {error && (
              <div className="mt-2 text-red-500 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {error}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-amber-100">
            <h2 className="text-xl font-medium mb-4 text-gray-800">
              Your Facilities
            </h2>

            {facilities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No facilities added yet. Add your first facility above.
              </div>
            ) : (
              <div className="space-y-3">
                {facilities.map((facility: any) => (
                  <div
                    key={facility.id}
                    className="flex flex-wrap items-start justify-between p-3 border border-gray-200 rounded-lg hover:border-amber-200 transition-colors"
                  >
                    <div className="flex items-start flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={facility.status}
                        onChange={() =>
                          handleToggleFacility(facility._id, facility.status)
                        }
                        className="mr-3 h-5 w-5 accent-amber-500 mt-1"
                      />
                      <div className="flex flex-col">
                        <span
                          className={
                            facility.status
                              ? "text-gray-800 font-medium"
                              : "text-gray-400 line-through"
                          }
                        >
                          {facility.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ₹{facility.price}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {facility.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0">
                      <span
                        className={`px-2 py-1 rounded-full text-sm mr-3 ${
                          facility.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {facility.status ? "Available" : "Blocked"}
                      </span>
                      <button
                        onClick={() => handleRemoveFacility(facility._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
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
            </div>
          )}
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
