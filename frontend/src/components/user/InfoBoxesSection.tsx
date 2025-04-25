import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import main_pic_1 from "../../../assets/user/main1.jpg";
import main_pic_2 from "../../../assets/user/main2.jpg";
import m2 from "../../../assets/user/m2.jpg";

interface HostelType {
  _id: string;
  photos: any[];
  hostel_name: string;
  averageRating?: number;
  ratingCount?: number;
  location?: { address: string };
  provider_id?: { fullName: string };
}

interface InfoBoxesSectionProps {
  filteredHostels?: HostelType[];
}

export const InfoBoxesSection = ({ filteredHostels = [] }: InfoBoxesSectionProps) => {
  const navigate = useNavigate();

  const handleHostelClick = (hostelId: string) => {
    navigate(`/accommodations/${hostelId}`);
  };

  return (
    <div className="pt-6 md:pt-9 px-4">
      {/* Full-width black background */}
      <div className="py-8 md:py-12 bg-black rounded-lg">
        <section className="grid gap-4 md:gap-6 max-w-6xl mx-auto">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {/* Text Box with Arrow */}
            <div className="relative font-dm_sans bg-[#B58C5F] rounded-2xl p-4 md:p-6 text-white shadow-md flex flex-col justify-between w-full">
              <p className="text-base md:text-[18px] leading-[1.5] md:leading-[1.7]">
                "Your perfect stay awaits— <br />
                where comfort meets care. <br />
                <span>For boys, for girls, for everyone.</span>
                A place where warmth embraces you, where every corner speaks
                of home. <br />
                Discover a haven designed with love, crafted for your peace
                and ease."
              </p>

              <div className="absolute top-4 right-4 bg-white text-[#B58C5F] rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg text-lg md:text-xl font-bold">
                ➜
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {filteredHostels?.slice(0, 2).map((hostel, index) => (
                <div 
                  key={index} 
                  className="relative flex flex-col items-center cursor-pointer group"
                  onClick={() => handleHostelClick(hostel._id)}
                >
                  {/* Background Shape Behind Image */}
                  <div className="absolute top-2 w-[95%] h-[180px] md:h-[225px] bg-gray-100 rounded-2xl"></div>

                  {/* Image */}
                  <motion.div 
                    className="relative w-[95%] h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md z-10"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={hostel.photos?.[0] || m2}
                      alt={hostel.hostel_name?.toString()}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover overlay with details */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-3"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Content Container */}
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Hostel Name */}
                        <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                          {hostel.hostel_name}
                        </h4>
                        
                        {/* Rating */}
                        {hostel.averageRating !== undefined && (
                          <div className="flex items-center space-x-1 text-amber-400 text-xs mb-1">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-3 w-3 fill-amber-400" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white text-xs">
                              {hostel.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        
                        {/* Truncated Location - only show for larger screens */}
                        {hostel.location?.address && (
                          <div className="hidden md:flex items-center space-x-1 text-white/90 text-xs">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span className="truncate max-w-[80px]">{hostel.location.address}</span>
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
                  <p className="text-black text-center text-xs md:text-sm mt-1 z-0">
                    {hostel.hostel_name}
                  </p>
                </div>
              ))}
              {filteredHostels?.length === 0 && [
                { src: main_pic_1, title: "Comfy Haven" },
                { src: main_pic_2, title: "She Home" },
              ].map((room, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  <div className="absolute top-2 w-[95%] h-[180px] md:h-[225px] bg-gray-100 rounded-2xl"></div>
                  <div className="relative w-[95%] h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md z-10">
                    <img
                      src={room.src}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-center text-xs md:text-sm mt-1 z-0">
                    {room.title}
                  </p>
                </div>
              ))}
              {filteredHostels?.length === 1 && (
                <div className="relative flex flex-col items-center">
                  <div className="absolute top-2 w-[95%] h-[180px] md:h-[225px] bg-gray-100 rounded-2xl"></div>
                  <div className="relative w-[95%] h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md z-10">
                    <img
                      src={main_pic_2}
                      alt="She Home"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-center text-xs md:text-sm mt-1 z-0">
                    She Home
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Centered Info Box */}
          <div className="font-dm_sans bg-[#B58C5F] rounded-2xl py-4 md:py-5 px-4 text-white shadow-md items-center flex flex-col">
            <p className="text-base md:text-[18px] leading-[1.7] md:leading-[2]">
              "Find your perfect place to stay— where comfort, convenience,
              and community come together.
              <br />
              A space designed for you, where every moment feels like home,
              and every stay becomes a cherished memory."
              <br />
              "Whether it's a boys' hostel, a girls' haven, or shared
              living, we're here to help you create lasting memories in a
              home away from home. <br />
              Experience warmth, belonging, and a place that truly cares.
              ❤️"
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoBoxesSection; 