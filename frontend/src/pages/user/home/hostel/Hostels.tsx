import { Search, ChevronDown, MapPin } from "lucide-react";
import HostelCard from "./components/HostelCard";
import Sidebar from "./components/Sidebar";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import main from "@/assets/user/m2.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
import Loading from "@/components/global/Loading";
import { useHostels, useNearbyHostels } from "@/hooks/user/useUserQueries";
import { Pagination } from "@/components/global/Pagination";
import { toast } from "sonner";

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
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setIsNearbyActive(false);
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleNearbyClick = () => {
    if (isNearbyActive) {
      // Turn off nearby mode
      setIsNearbyActive(false);
      setCoordinates({ latitude: null, longitude: null });
      return;
    }

    // Turn on nearby mode
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsNearbyActive(true);
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        if (error.code === 1) {
          errorMessage = "Location access denied. Please enable location services.";
        }
        toast.error(errorMessage);
        setIsGettingLocation(false);
      }
    );
  };

  // Use the regular hostels query if nearby is not active
  const { 
    data: regularHostels = [], 
    isLoading: isLoadingRegular, 
    error: regularError 
  } = useHostels(filters);
  
  // Use the nearby hostels query if nearby is active
  const { 
    data: nearbyHostels = [], 
    isLoading: isLoadingNearby, 
    error: nearbyError 
  } = useNearbyHostels(
    coordinates.latitude, 
    coordinates.longitude,
    5 // Default radius in km
  );

  // Determine which data source to use
  const hostels = isNearbyActive ? nearbyHostels : regularHostels;
  const isLoading = isNearbyActive ? isLoadingNearby : isLoadingRegular;
  const error = isNearbyActive ? nearbyError : regularError;

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
                    <div className="flex space-x-2">
                      <button
                        onClick={handleNearbyClick}
                        disabled={isGettingLocation}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                          isGettingLocation 
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : isNearbyActive
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-amber-50"
                        }`}
                      >
                        <MapPin size={16} className="mr-2" />
                        {isGettingLocation ? "Locating..." : "Nearby"}
                      </button>
                      <div className="relative w-40">
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
                </div>

                {/* Loading State */}
                {(isLoading || isGettingLocation) && (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loading 
                      text={isGettingLocation ? "locating you" : "loading accommodations"} 
                      color="#b9a089" 
                    />
                  </div>
                )}

                {/* Error State */}
                {error && !isLoading && !isGettingLocation && (
                  <div className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
                    Failed to load hostels. Please try again later.
                  </div>
                )}

                {/* Hostel Grid */}
                {!isLoading && !isGettingLocation && !error && (
                  <>
                    {isNearbyActive && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-amber-800 text-sm">
                          Showing hostels near your current location (within 5km radius)
                        </p>
                      </div>
                    )}
                    
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
                {!isLoading && !isGettingLocation && !error && hostels.length === 0 && (
                  <div className="text-center text-gray-500 min-h-[400px] flex items-center justify-center">
                    {isNearbyActive 
                      ? "No hostels found near your location" 
                      : "No hostels found"}
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
