import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAllHostels } from "@/services/Api/providerApi";
import { motion } from "framer-motion";
import { MapPin, Users, Bed, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/global/Loading";

const ITEMS_PER_PAGE = 6;

const Properties = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: hostels, isLoading } = useQuery({
    queryKey: ["provider-hostels"],
    queryFn: listAllHostels,
  });

  // Filter hostels based on search
  const filteredHostels = hostels?.filter(
    (hostel: any) =>
      hostel.hostel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredHostels?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHostels = filteredHostels?.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 mt-1">
              Manage your listed properties and rooms
            </p>
          </div>
          <button
            onClick={() => navigate("/provider/properties/add")}
            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Property
          </button>
        </div>

        {/* Search and Filters */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading text="Loading properties" />
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHostels?.map((hostel: any) => (
              <motion.div
                key={hostel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative h-48">
                  <img
                    src={hostel.photos[0]}
                    alt={hostel.hostel_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-semibold">
                      ₹{hostel.monthly_rent}/month
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        hostel.is_verified
                          ? "bg-green-500/90 text-white"
                          : "bg-yellow-500/90 text-white"
                      }`}
                    >
                      {hostel.is_verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {hostel.hostel_name}
                  </h3>

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

                  {/* Actions */}
                  {/* <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/provider/properties/edit/${hostel._id}`)}
                      className="p-2 text-gray-600 hover:text-amber-500 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {}}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div> */}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && currentHostels?.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first property
              </p>
              <button
                onClick={() => navigate("/provider/properties/add")}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
          </div>
        )}

        {/* Results Counter */}
        {totalItems > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} properties
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
