import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StaySelector from "../../ui/StaySelector";
import m2 from "../../../assets/user/m2.jpg";

interface HostelType {
  _id: string;
  photos: any[];
  hostel_name: string;
  averageRating?: number;
  ratingCount?: number;
  location?: { address: string };
  provider_id?: { fullName: string };
  gender: string;
}

interface RoomOptionsSectionProps {
  hostels?: HostelType[];
}

export const RoomOptionsSection = ({ hostels = [] }: RoomOptionsSectionProps) => {
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const navigate = useNavigate();

  const filteredHostels = hostels?.filter((hostel) => {
    if (selectedGender === "all") return true;
    return hostel.gender === selectedGender;
  }).slice(0, 3);

  const handleHostelClick = (hostelId: string) => {
    navigate(`/accommodations/${hostelId}`);
  };

  return (
    <section className="mb-12 pt-4">
      <h2 className="font-italiana text-center text-4xl font-light mb-6">
        Decide Your Stay
      </h2>
      <StaySelector onGenderChange={setSelectedGender} />
      <div className="grid gap-6 max-w-4xl mx-auto px-4 cursor-pointer place-items-center">
        {filteredHostels?.length > 0 ? (
          <div className={`grid gap-6 w-full ${
            filteredHostels.length === 1 ? 'grid-cols-1 justify-items-center' : 
            filteredHostels.length === 2 ? 'sm:grid-cols-2 grid-cols-1 justify-items-center' : 
            'sm:grid-cols-2 md:grid-cols-3 grid-cols-1 justify-items-center'
          }`}>
            {filteredHostels.map((hostel, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center w-full max-w-[280px] group"
                onClick={() => handleHostelClick(hostel._id)}
              >
                <div className="bg-gray-100 rounded-2xl w-full h-80 absolute"></div>
                <motion.div 
                  className="relative w-full h-72 rounded-2xl overflow-hidden shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={hostel.photos?.[0] || m2}
                    alt={hostel.hostel_name?.toString()}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay - only visible on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Content Container */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Hostel Name and Gender */}
                      <h3 className="text-lg font-semibold text-white line-clamp-1 mb-2">
                        {hostel.hostel_name}
                      </h3>
                      
                      {/* Rating Display */}
                      {hostel.averageRating !== undefined && (
                        <div className="flex items-center space-x-2 text-amber-400 text-sm mb-2">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 fill-amber-400" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white">
                            {hostel.averageRating.toFixed(1)} ({hostel.ratingCount} {hostel.ratingCount === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                      )}
                      
                      {/* Location */}
                      {hostel.location?.address && (
                        <div className="flex items-center space-x-2 text-white/90 text-sm mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span className="line-clamp-1">{hostel.location.address}</span>
                        </div>
                      )}
                      
                      {/* Provider */}
                      {hostel.provider_id?.fullName && (
                        <div className="flex items-center space-x-2 text-white/80 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <span className="line-clamp-1">
                            By {hostel.provider_id.fullName}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                  
                  {/* Outline on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl ring-1 ring-white/30 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <div className="relative text-gray-900 text-sm font-medium mt-2 text-center">
                  {hostel.hostel_name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">No hostels found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomOptionsSection; 