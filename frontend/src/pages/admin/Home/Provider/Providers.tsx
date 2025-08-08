import { useState } from "react";
import DataTable from "@/components/global/DataTable";
import { updateStatus, verifyProviderDocument } from "@/services/Api/admin/adminApi";
import { IUser } from "@/types/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useProviders } from "@/hooks/admin/useAdminQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/global/Loading";
import { useDebounce } from "@/hooks/useDebounce";
// import { Eye, CheckCircle, X, AlertCircle, Shield, FileText } from "lucide-react";
import { Eye, CheckCircle, X, AlertCircle } from "lucide-react";

const Providers = () => {
  const limit = 2;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<IUser | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const { data, isLoading, isError } = useProviders(
    debouncedSearchQuery,
    page,
    limit
  );
  const queryClient = useQueryClient();

  const toggleUserStatus = useMutation({
    mutationFn: (email: string) => updateStatus(email),
    onSuccess: (responseData, email) => {
      queryClient.setQueryData(
        ["admin-providers", debouncedSearchQuery, page, limit],
        (oldData: any) => {
          if (!oldData) return oldData;
          const updatedUsers = oldData.data.map((user: any) =>
            user.email === email
              ? { ...user, is_active: !user.is_active }
              : user
          );
          return { ...oldData, data: updatedUsers };
        }
      );

      toast.success(responseData?.data?.message || "Status updated successfully", {
        style: {
          background: "rgb(220 255 228)",
          color: "#15803d",
          border: "1px solid #334155",
        },
      });
    },
    onError: () => {
      toast.error("Failed to update user status", {
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
          border: "1px solid #334155",
        },
      });
    },
  });

  const verifyDocument = useMutation({
    mutationFn: (email: string) => verifyProviderDocument(email),
    onSuccess: (responseData) => {
      toast.success(responseData?.data?.message || "Document verified successfully", {
        style: {
          background: "rgb(220 255 228)",
          color: "#15803d",
          border: "1px solid #334155",
        },
      });
      setShowDocumentModal(false);
      setSelectedProvider(null);
      // Refresh the providers data
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
    onError: () => {
      toast.error("Failed to verify provider document", {
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
          border: "1px solid #334155",
        },
      });
    },
  });

  const handleViewDocument = (provider: IUser) => {
    setSelectedProvider(provider);
    setShowDocumentModal(true);
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "aadhar":
        return "Aadhar Card";
      case "pan":
        return "PAN Card";
      case "passport":
        return "Passport";
      case "driving_license":
        return "Driving License";
      default:
        return "Not Provided";
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-[#242529] justify-center items-center min-h-screen">
        <Loading
          text="Loading providers..."
          color="#6366f1"
          className="text-white"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load providers!
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-slate-400 mt-10">
        No providers found.
      </div>
    );
  }

  const columns = [
    {
      header: "No",
      render: (_: IUser, i: number) => `${i + 101}`,
    },
    {
      key: "fullName",
      header: "User",
      render: (user: IUser) => (
        <div className="flex">
          <span className="font-medium text-yellow-500">{user.fullName}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    {
      header: "Joined",
      render: (user: IUser) =>
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    },
    {
      header: "Status",
      render: (user: IUser) => (
        <AnimatePresence mode="wait">
          <motion.span
            key={`${user.email}-${user.is_active}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              user.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.is_active ? "Active" : "Blocked"}
          </motion.span>
        </AnimatePresence>
      ),
    },
    {
      header: "Actions",
      render: (user: IUser) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleUserStatus.mutate(user.email)}
            className={`px-3 py-1 rounded text-white text-xs font-semibold transition-all duration-200 ${
              user.is_active
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {user.is_active ? "Block" : "Unblock"}
          </button>
          <button
            onClick={() => handleViewDocument(user)}
            className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-all duration-200"
          >
            <Eye size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg bg-[#242529] text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />

      {/* Document Verification Modal */}
      <AnimatePresence>
        {showDocumentModal && selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowDocumentModal(false);
              setSelectedProvider(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#242529] rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6"
              >
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between items-center mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-200">
                    Provider Document Verification
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowDocumentModal(false);
                      setSelectedProvider(null);
                    }}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#1e293b] p-4 rounded-lg border border-gray-700"
                  >
                    <p className="text-sm text-gray-400 mb-1">Provider Name</p>
                    <p className="font-medium text-gray-200">
                      {selectedProvider.fullName}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#1e293b] p-4 rounded-lg border border-gray-700"
                  >
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="font-medium text-gray-200">
                      {selectedProvider.email}
                    </p>
                  </motion.div>

                  {selectedProvider.documentType ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-[#1e293b] p-4 rounded-lg border border-gray-700"
                      >
                        <p className="text-sm text-gray-400 mb-1">
                          Document Type
                        </p>
                        <p className="font-medium text-gray-200">
                          {getDocumentTypeLabel(selectedProvider.documentType)}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-[#1e293b] p-4 rounded-lg border border-gray-700"
                      >
                        <p className="text-sm text-gray-400 mb-1">
                          Verification Status
                        </p>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 }}
                          className="flex items-center"
                        >
                          {selectedProvider.isDocumentVerified ? (
                            <>
                              <CheckCircle
                                className="text-green-500 mr-2"
                                size={16}
                              />
                              <span className="text-green-400 font-medium">
                                Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle
                                className="text-yellow-500 mr-2"
                                size={16}
                              />
                              <span className="text-yellow-400 font-medium">
                                Pending Verification
                              </span>
                            </>
                          )}
                        </motion.div>
                      </motion.div>

                      {selectedProvider.documentImage && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="bg-[#1e293b] p-4 rounded-lg border border-gray-700"
                        >
                          <p className="text-sm text-gray-400 mb-2">
                            Document Image
                          </p>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="border border-gray-600 rounded-lg overflow-hidden bg-gray-800"
                          >
                            <img
                              src={selectedProvider.documentImage}
                              alt="Document"
                              className="w-full h-64 object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/400x200?text=Document+Image";
                              }}
                            />
                          </motion.div>
                        </motion.div>
                      )}

                      {!selectedProvider.isDocumentVerified && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 }}
                          className="flex justify-end space-x-3 pt-4 border-t border-gray-700"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowDocumentModal(false);
                              setSelectedProvider(null);
                            }}
                            className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              verifyDocument.mutate(selectedProvider.email)
                            }
                            disabled={verifyDocument.isPending}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                          >
                            {verifyDocument.isPending ? (
                              <>
                                <Loading size="small" text="" className="mr-2" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="mr-2" />
                                Verify Document
                              </>
                            )}
                          </motion.button>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-center py-8 bg-[#1e293b] rounded-lg border border-gray-700"
                    >
                      <p className="text-gray-400">
                        No document uploaded by this provider
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Providers;
