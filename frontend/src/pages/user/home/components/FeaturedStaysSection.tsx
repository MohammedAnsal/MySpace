import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import m1 from "@/assets/user/m1.jpg";
import m2 from "@/assets/user/m2.jpg";

interface FeaturedStaysSectionProps {
  filteredHostels: any[];
  handleHostelClick: (id: string) => void;
}

const FeaturedStaysSection = ({ filteredHostels, handleHostelClick }: FeaturedStaysSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-italiana text-4xl md:text-5xl text-center mb-10">Featured Stays</h2>
        
        {filteredHostels?.length > 0 ? (
          <div className="grid gap-10">
            {/* Premium Featured Hostel */}
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => filteredHostels[0] && handleHostelClick(filteredHostels[0]._id)}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <img 
                    src={filteredHostels[0]?.photos?.[0] || m1} 
                    alt={filteredHostels[0]?.hostel_name?.toString() || "Featured Hostel"} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-l"></div>
                </div>
                
                {/* Content Section */}
                <div className="md:w-1/2 bg-[#B58C5F] p-6 md:p-8 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                      {filteredHostels[0]?.hostel_name || "Premium Accommodation"}
                    </h3>
                      
                    {filteredHostels[0]?.location?.address && (
                      <div className="flex items-center mb-4">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <p className="text-white/90">{filteredHostels[0].location.address}</p>
                      </div>
                    )}
                    
                    <p className="mb-6 text-white/80 leading-relaxed">
                      Experience exceptional comfort and convenience in our premium accommodations.
                      Perfect for {filteredHostels[0]?.gender === 'male' ? 'male' : 'female'} students and professionals 
                      looking for a place that feels like home.
                    </p>
                    
                    {filteredHostels[0]?.averageRating !== undefined && (
                      <div className="flex items-center space-x-2 text-amber-300 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 ${i < Math.round(filteredHostels[0].averageRating) ? 'fill-amber-300' : 'fill-white/30'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-white ml-2">
                          {filteredHostels[0].averageRating.toFixed(1)} ({filteredHostels[0].ratingCount} {filteredHostels[0].ratingCount === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <motion.button 
                    className="self-end mt-4 flex items-center text-white font-medium group"
                    whileHover={{ x: 5 }}
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            {/* Hostel Highlights Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {filteredHostels.slice(0, 3).map((hostel, index) => (
                <motion.div
                  key={index} 
                  className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => handleHostelClick(hostel._id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hostel.photos?.[0] || m2}
                      alt={hostel.hostel_name?.toString()}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 text-[#384f95] text-xs font-medium py-1 px-2 rounded-full">
                      {hostel.gender === 'male' ? 'Boys Hostel' : 'Girls Hostel'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#B58C5F] transition-colors">
                        {hostel.hostel_name}
                      </h3>
                      {hostel.averageRating !== undefined && (
                        <div className="flex items-center text-amber-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm">{hostel.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                        
                    {hostel.location?.address && (
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="truncate">{hostel.location.address}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-[#B58C5F] text-sm font-medium">View details</span>
                      <motion.div
                        className="w-6 h-6 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#384f95]"
                        whileHover={{ scale: 1.1, x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-md">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No hostels found for this filter</h3>
            <p className="text-gray-600 mb-6">Try changing your filter selection or explore all accommodations</p>
            <motion.button
              onClick={() => navigate('/accommodations')}
              className="px-6 py-3 bg-[#B58C5F] text-white font-medium rounded-lg shadow-md hover:bg-[#a07a4f] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse All Accommodations
            </motion.button>
          </div>
        )}
        
        {/* Inspiration Quote */}
        <InspirationQuote />
      </div>
    </section>
  );
};

// Separate component for the Inspiration Quote
const InspirationQuote = () => {
  return (
    <motion.div 
      className="mt-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#384f95] to-[#B58C5F] opacity-10 rounded-2xl"></div>
      
      <div className="bg-[#B58C5F] rounded-2xl py-10 px-8 text-white shadow-xl relative z-10 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        {/* Quote Marks */}
        <div className="text-white/30 text-8xl font-serif absolute top-2 left-4 leading-none">"</div>
        <div className="text-white/30 text-8xl font-serif absolute bottom-0 right-4 leading-none">"</div>
        
        <div className="max-w-4xl mx-auto relative">
          <motion.p 
            className="text-center text-lg md:text-xl leading-relaxed font-dm_sans"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Find your perfect place to stay— where comfort, convenience,
            and community come together. A space designed for you, where every moment feels like home,
            and every stay becomes a cherished memory.
          </motion.p>
          
          <motion.p
            className="text-center text-lg md:text-xl mt-4 leading-relaxed font-dm_sans"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Whether it's a boys' hostel, a girls' haven, or shared
            living, we're here to help you create lasting memories in a home away from home.
          </motion.p>
          
          <motion.div
            className="flex justify-center mt-6 items-center"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-white/80 font-medium italic">Experience warmth, belonging, and a place that truly cares</span>
            <motion.span 
              className="text-2xl ml-2"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut" 
              }}
            >
              ❤️
            </motion.span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedStaysSection; 