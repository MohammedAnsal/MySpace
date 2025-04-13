import { Search, ChevronDown } from "lucide-react";
import HostelCard from "./components/HostelCard";
import Sidebar from "./components/Sidebar";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import main from "@/assets/user/m2.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
import Loading from "@/components/global/Loading";
import { useHostels } from "@/hooks/user/useUserQueries";
import { Pagination } from "@/components/global/Pagination";

const ITEMS_PER_PAGE = 6;

const Hostels = () => {
  const [filters, setFilters] = useState({
    minPrice: 10,
    maxPrice: 5000,
    gender: "",
    amenities: [] as string[],
    search: "",
    sortBy: "asc" as "asc" | "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const { data: hostels = [], isLoading, error } = useHostels(filters);

  const totalItems = hostels.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHostels = hostels.slice(startIndex, endIndex);

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
                  onFilterChange={handleFilterChange}
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
                          handleFilterChange({ search: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <div className="relative w-full sm:w-40">
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          handleFilterChange({
                            sortBy: e.target.value as "asc" | "desc",
                          })
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
                      {currentHostels.map((hostel) => (
                        <HostelCard key={hostel._id} hostel={hostel} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
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
                {!isLoading && !error && hostels.length === 0 && (
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
