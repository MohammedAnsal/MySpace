import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Wifi,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Shield,
  Home,
  CheckCircle,
  Info,
  MessageCircle,
  MessageSquare,
  User,
  Car,
  AirVent,
  CookingPot,
  WashingMachine,
  Cctv,
  GlassWaterIcon,
  Maximize2,
} from "lucide-react";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Loading from "@/components/global/Loading";
import {
  useHostelDetails,
  useHostelRatings,
} from "@/hooks/user/useUserQueries";
import RatingSection from "@/pages/user/Home/hostel/components/RatingSection";
import Scroll from "@/components/global/Scroll";
import ImageGalleryPopup from "./components/ImageGalleryPopup";
import MapModal from "./components/MapModal";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const getAmenityIcon = (amenity: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    Wifi: <Wifi className="w-5 h-5" />,
    Parking: <Car className="w-5 h-5" />,
    Kitchen: <CookingPot className="w-5 h-5" />,
    Laundry: <WashingMachine className="w-5 h-5" />,
    Cctv: <Cctv className="w-5 h-5" />,
    "Water filter": <GlassWaterIcon className="w-5 h-5" />,
    "Air Conditioning": <AirVent className="w-5 h-5" />,
  };

  return iconMap[amenity] || <CheckCircle className="w-5 h-5" />;
};

const HostelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: hostel, isLoading } = useHostelDetails(id);
  const { data: ratingData, isLoading: ratingsLoading } = useHostelRatings(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading
          text="Loading details..."
          color="#b9a089"
          className="text-black"
        />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-[#E2E1DF] py-8 flex justify-center items-center">
        <p className="text-gray-500 text-xl">Hostel details not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#E2E1DF] py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-8 rounded-xl bg-[#F2F2F2]"
        >
          {/* Header Section */}
          <motion.div
            {...fadeInUp}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-4"
            >
              <Home className="w-8 h-8 text-main-color" />
              <h1 className="text-3xl font-bold text-gray-900">
                {hostel.hostel_name}
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4 text-gray-600"
            >
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-main-color mr-2" />
                <span>{hostel.location?.address}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-main-color mr-2" />
                <span>{hostel.gender} Hostel</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-600">Verified Property</span>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <motion.div
                {...fadeInUp}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-96 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedImage(hostel.photos[0]);
                      setIsGalleryOpen(true);
                    }}
                  >
                    <img
                      src={hostel.photos[0]}
                      alt={hostel.hostel_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                  <div className="grid grid-cols-2 gap-4">
                    {hostel.photos
                      ?.slice(1, 5)
                      .map((photo: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="h-44 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedImage(photo);
                            setIsGalleryOpen(true);
                          }}
                        >
                          <img
                            src={photo}
                            alt={`${hostel.hostel_name} ${index + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Info className="w-6 h-6 text-main-color mr-2" />
                  About this hostel
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {hostel.description}
                </p>
              </motion.div>

              {/* Amenities Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Shield className="w-6 h-6 text-main-color mr-2" />
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {hostel.amenities?.map((amenity: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3 bg-[#384f9514] p-3 rounded-lg"
                    >
                      <span className="text-main-color">
                        {getAmenityIcon(amenity)}
                      </span>
                      <span className="text-gray-700">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Facilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Shield className="w-6 h-6 text-main-color mr-2" />
                  Additional Facilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {hostel.facilities?.map((facility: any, index: number) => (
                    <motion.div
                      key={facility._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-br from-[#384f9514] to-[#384f9514] rounded-xl p-6 border border-amber-200/30"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {facility.name}
                        </h3>
                        <div className="flex items-center text-main-color font-semibold bg-[#384f9514] px-3 py-1 rounded-full">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {facility.price}
                        </div>
                      </div>
                      <p className="text-gray-600">{facility.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <motion.div {...fadeInUp} className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Info className="w-6 h-6 text-main-color mr-2" />
                  Provider Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 text-main-color mr-3" />
                    <span>
                      {hostel.provider_id?.fullName ||
                        "Contact number not available"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 text-main-color mr-3" />
                    <span>
                      {hostel.provider_id?.phone ||
                        "Contact number not available"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 text-main-color mr-3" />
                    <span>
                      {hostel.provider_id?.email || "Email not available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat with Provider */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MessageCircle className="w-6 h-6 text-main-color mr-2" />
                  Chat with Provider
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Have questions? Chat directly with the property owner.
                  </p>
                  <motion.button
                    onClick={() => navigate("/user/chat")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-main-color text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <div className="flex items-center justify-center relative z-10">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Start Chat
                    </div>
                  </motion.button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-3xl font-bold text-main-color mb-4 flex items-center">
                  <DollarSign className="w-8 h-8 mr-2" />
                  {hostel.monthly_rent}
                  <span className="text-base font-normal text-gray-500 ml-2">
                    /month
                  </span>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Deposit</span>
                    <span className="font-semibold">
                      ${hostel.deposit_amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Available Beds</span>
                    <span
                      className={`font-semibold ${
                        hostel.available_space === 0 ? "text-red-500" : ""
                      }`}
                    >
                      {hostel.available_space} of {hostel.total_space}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Maximum Occupancy</span>
                    <span className="font-semibold">
                      {hostel.maximum_occupancy}
                    </span>
                  </div>
                </div>
                {hostel.available_space > 0 ? (
                  <motion.button
                    onClick={() =>
                      navigate("/checkout", {
                        state: {
                          hostelId: hostel._id,
                          providerId: hostel.provider_id._id,
                          monthlyRent: hostel.monthly_rent,
                          depositAmount: hostel.deposit_amount,
                        },
                      })
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-main-color text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <div className="flex items-center justify-center relative z-10">
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Now
                    </div>
                  </motion.button>
                ) : (
                  <div className="w-full text-center">
                    <p className="text-red-500 font-medium mb-2">
                      No beds available
                    </p>
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed opacity-70"
                    >
                      <div className="flex items-center justify-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Fully Booked
                      </div>
                    </button>
                  </div>
                )}
              </div>
              {/* Map */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="w-6 h-6 text-main-color mr-2" />
                  Location
                </h3>
                <div
                  className="h-[200px] rounded-lg overflow-hidden mb-4 relative group cursor-pointer"
                  onClick={() => setIsMapModalOpen(true)}
                >
                  {hostel.location?.latitude && hostel.location?.longitude && (
                    <>
                      <div className="absolute top-2 right-2 bg-white/80 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-5 h-5 text-gray-700" />
                      </div>
                      <MapContainer
                        center={[
                          hostel.location.latitude,
                          hostel.location.longitude,
                        ]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                        className="rounded-lg z-10"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            hostel.location.latitude,
                            hostel.location.longitude,
                          ]}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-medium text-gray-900">
                                {hostel.hostel_name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {hostel.location.address}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </>
                  )}
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-main-color mt-1 flex-shrink-0" />
                  <p className="ml-2 text-gray-600 text-sm">
                    {hostel.location?.address}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full width ratings section */}
          <RatingSection ratingData={ratingData} isLoading={ratingsLoading} />
        </motion.div>
      </div>

      {/* Image Gallery Popup */}
      <AnimatePresence>
        {isGalleryOpen && (
          <ImageGalleryPopup
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            hostel={hostel}
            selectedImage={selectedImage}
          />
        )}
      </AnimatePresence>

      {/* Map Modal */}
      <AnimatePresence>
        {isMapModalOpen &&
          hostel.location?.latitude &&
          hostel.location?.longitude && (
            <MapModal
              isOpen={isMapModalOpen}
              onClose={() => setIsMapModalOpen(false)}
              latitude={hostel.location.latitude}
              longitude={hostel.location.longitude}
              hostelName={hostel.hostel_name}
              address={hostel.location.address}
            />
          )}
      </AnimatePresence>
      <Scroll />

      <Footer />
    </>
  );
};

export default HostelDetails;
