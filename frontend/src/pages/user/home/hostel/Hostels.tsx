import { Search, ChevronDown, MapPin } from "lucide-react";
import HostelCard from "./components/HostelCard";
import Sidebar from "./components/Sidebar";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import main from "@/assets/user/m2.jpg";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Loading from "@/components/global/Loading";
import { useHostels, useNearbyHostels } from "@/hooks/user/hostel/useHostel";
import { Pagination } from "@/components/global/Pagination";
import Scroll from "@/components/global/Scroll";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

const Hostels = () => {
  // Initialize filters from localStorage or use defaults
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("hostelFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          minPrice: 10,
          maxPrice: 5000,
          gender: "",
          amenities: [] as string[],
          search: "",
          sortBy: "asc" as "asc" | "desc",
          minRating: undefined as number | undefined,
          sortByRating: false,
        };
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("hostelFilters", JSON.stringify(filters));
  }, [filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isNearbyActive, setIsNearbyActive] = useState(() => {
    const savedNearby = localStorage.getItem("nearbyLocation");
    return savedNearby ? JSON.parse(savedNearby).isActive : false;
  });
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>(() => {
    const savedNearby = localStorage.getItem("nearbyLocation");
    return savedNearby
      ? JSON.parse(savedNearby).coordinates
      : {
          latitude: null,
          longitude: null,
        };
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setCurrentPage(1);
    setFilters((prev: any) => {
      const updatedFilters = { ...prev, ...newFilters };
      return updatedFilters;
    });
  };

  const handleNearbyClick = () => {
    if (isNearbyActive) {
      setIsNearbyActive(false);
      setCoordinates({ latitude: null, longitude: null });
      return;
    }

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
          errorMessage =
            "Location access denied. Please enable location services.";
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
    error: regularError,
  } = useHostels(filters);

  // Use the nearby hostels query if nearby is active
  const {
    data: nearbyHostels = [],
    isLoading: isLoadingNearby,
    error: nearbyError,
  } = useNearbyHostels(coordinates.latitude, coordinates.longitude, 20);

  // Determine which data source to use

  const hostels = isNearbyActive ? nearbyHostels : regularHostels;
  const isLoading = isNearbyActive ? isLoadingNearby : isLoadingRegular;
  const error = isNearbyActive ? nearbyError : regularError;

  const totalItems = hostels.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHostels = hostels.slice(startIndex, endIndex);

  useEffect(() => {
    localStorage.setItem(
      "nearbyLocation",
      JSON.stringify({
        isActive: isNearbyActive,
        coordinates: coordinates,
      })
    );
  }, [isNearbyActive, coordinates]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#E2E1DF]">
        {/* Hero Section - Enhanced with better animations */}
        <section className="relative h-[50vh] md:h-[60vh] flex flex-col items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={main}
              alt="Find your next stay"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
            <motion.h1
              className="font-italiana text-4xl md:text-6xl lg:text-7xl mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Find your next stay
            </motion.h1>

            <motion.p
              className="font-dm_sans text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Search low prices on hostels, homes and much more...
            </motion.p>
          </div>
        </section>

        <section className="py-8">
          <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-8 bg-[#F2F2F2] rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar with animation */}
              <motion.div
                className="w-full md:w-64 shrink-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Sidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </motion.div>

              {/* Main Content */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Search and Sort Bar with animation */}
                <motion.div
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                      <input
                        type="text"
                        placeholder="Search by hostel name or location"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange({ search: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B58C5F] transition-all duration-300"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-[#B58C5F] transition-colors duration-300" />
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNearbyClick}
                        disabled={isGettingLocation}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-300 ${
                          isGettingLocation
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : isNearbyActive
                            ? "bg-[#B58C5F] text-white border-[#B58C5F]"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-[#B58C5F] hover:text-white"
                        }`}
                      >
                        <MapPin size={16} className="mr-2" />
                        {isGettingLocation ? "Locating..." : "Nearby"}
                      </motion.button>
                      <div className="relative w-40">
                        <select
                          value={
                            filters.sortByRating
                              ? `rating-${filters.sortBy}`
                              : `price-${filters.sortBy}`
                          }
                          onChange={(e) => {
                            const [field, direction] =
                              e.target.value.split("-");
                            handleFilterChange({
                              sortBy: direction as "asc" | "desc",
                              sortByRating: field === "rating",
                            });
                          }}
                          className="w-full appearance-none px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#B58C5F] transition-all duration-300"
                        >
                          <option value="price-asc">₹ Low to High</option>
                          <option value="price-desc">₹ High to Low</option>
                          <option value="rating-desc">
                            Rating: High to Low
                          </option>
                          <option value="rating-asc">
                            Rating: Low to High
                          </option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Loading State */}
                {(isLoading || isGettingLocation) && (
                  <motion.div
                    className="flex items-center justify-center min-h-[400px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loading
                      text={
                        isGettingLocation
                          ? "locating you"
                          : "loading accommodations"
                      }
                      color="#B58C5F"
                    />
                  </motion.div>
                )}

                {/* Error State */}
                {error && !isLoading && !isGettingLocation && (
                  <motion.div
                    className="text-center text-red-500 min-h-[400px] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Failed to load hostels. Please try again later.
                  </motion.div>
                )}

                {/* Hostel Grid with staggered animations */}
                {!isLoading && !isGettingLocation && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {isNearbyActive && (
                      <motion.div
                        className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-amber-800 text-sm">
                          Showing hostels near your current location (within 5km
                          radius)
                        </p>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentHostels.map((hostel, index) => (
                        <motion.div
                          key={hostel._id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <HostelCard hostel={hostel} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination with animation */}
                    {totalPages > 1 && (
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                      </motion.div>
                    )}

                    {/* Results Counter with animation */}
                    <motion.div
                      className="mt-4 text-center text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      Showing {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                      of {totalItems} results
                    </motion.div>
                  </motion.div>
                )}

                {/* Empty State with animation */}
                {!isLoading &&
                  !isGettingLocation &&
                  !error &&
                  hostels.length === 0 && (
                    <motion.div
                      className="text-center text-gray-500 min-h-[400px] flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {isNearbyActive
                        ? "No hostels found near your location"
                        : "No hostels found"}
                    </motion.div>
                  )}
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
      <Scroll />
      <Footer />
    </>
  );
};

export default Hostels;
