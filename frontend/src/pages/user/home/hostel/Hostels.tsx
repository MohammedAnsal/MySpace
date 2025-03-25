import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listAllHostels } from "@/services/Api/userApi";
import HostelCard from "./components/HostelCard";
import Sidebar from "./components/Sidebar";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import main from "@/assets/user/m2.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
import Loading from "@/components/global/Loading";

const ITEMS_PER_PAGE = 9;

const Hostels = () => {
  const [filters, setFilters] = useState({
    minPrice: 500,
    maxPrice: 20000,
    gender: "",
    amenities: [] as string[],
    search: "",
    sortBy: "asc" as "asc" | "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: hostels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hostels", filters],
    queryFn: () => listAllHostels(filters),
  });

  const totalItems = hostels?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHostels = hostels?.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#E2E1DF]">
        {/* Hero Section */}
        <div className="relative h-[500px] bg-gray-100">
          <img
            src={main}
            alt="Find your next stay"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-light text-white mb-4"
            >
              Find your next stay
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/90"
            >
              Search low prices on hostels, homes and much more...
            </motion.p>
          </div>
        </div>

        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-8 bg-[#F2F2F2] rounded-lg ">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <div className="w-full md:w-64 shrink-0">
                <Sidebar
                  filters={filters}
                  onFilterChange={(newFilters) =>
                    setFilters((prev) => ({ ...prev, ...newFilters }))
                  }
                />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Search and Sort Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search hostels"
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <div className="relative w-full sm:w-40">
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            sortBy: e.target.value as "asc" | "desc",
                          }))
                        }
                        className="w-full appearance-none px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="asc">₹ Low to High</option>
                        <option value="desc">₹ High to Low</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loading text="loading accomoodations" color="#b9a089" />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
                    Failed to load hostels. Please try again later.
                  </div>
                )}

                {/* Hostel Grid */}
                {!isLoading && !error && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentHostels?.map((hostel) => (
                        <HostelCard key={hostel._id} hostel={hostel} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center gap-2">
                        {/* Previous Button */}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              typeof pageNum === "number" &&
                              setCurrentPage(pageNum)
                            }
                            className={`px-4 py-2 rounded-lg ${
                              pageNum === currentPage
                                ? "bg-amber-500 text-white"
                                : pageNum === "..."
                                ? "cursor-default"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {/* Next Button */}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-lg ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {/* Results Counter */}
                    <div className="mt-4 text-center text-sm text-gray-500">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                      of {totalItems} results
                    </div>
                  </>
                )}

                {/* Empty State */}
                {!isLoading && !error && hostels?.length === 0 && (
                  <div className="text-center text-gray-500 min-h-[400px] flex items-center justify-center">
                    No hostels found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Hostels;
