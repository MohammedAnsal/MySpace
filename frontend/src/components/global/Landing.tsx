import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import main_pic_1 from "../../assets/user/main1.jpg";
import m1 from "../../assets/user/m1.jpg";
import m2 from "../../assets/user/m2.jpg";

export const Landing = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'user' | 'provider') => {
      if (role === 'user') {
      navigate('/auth/signIn');
      } else {
      navigate('/provider/signIn');
    }
  };

  return (
    <main className="min-h-screen bg-[#E2E1DF]">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={m1}
            alt="Hostel interior"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <motion.h1 
            className="font-italiana text-5xl md:text-7xl lg:text-8xl mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            MySpace
          </motion.h1>
          
          <motion.p 
            className="font-dm_sans text-lg md:text-xl mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find your perfect place to stay — where comfort meets convenience. 
            A home away from home designed with you in mind.
          </motion.p>
          
          {/* Role Selection */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={() => handleRoleSelection('user')}
              className="px-8 py-4 bg-[#B58C5F] text-white font-medium rounded-lg shadow-lg hover:bg-[#a07a4f] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              I'm Looking for a Stay
            </motion.button>
            
            <motion.button
              onClick={() => handleRoleSelection('provider')}
              className="px-8 py-4 bg-white text-[#384f95] font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              I'm a Property Owner
            </motion.button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="flex flex-col items-center text-white">
            <p className="mb-2 text-sm font-light">Scroll to explore</p>
            <div className="w-1 h-12 rounded-full bg-white/30 overflow-hidden">
              <motion.div 
                className="w-full h-1/2 bg-white rounded-full"
                animate={{ 
                  y: [0, 24, 0],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut" 
                }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-italiana text-4xl md:text-5xl text-center mb-16">What We Offer</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-[#B58C5F] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Accommodations</h3>
              <p className="text-gray-600">Carefully curated hostels and PGs that prioritize comfort, safety, and convenience.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-[#384f95] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Hassle-free booking process with secure payments and transparent pricing.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-[#B58C5F] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Living</h3>
              <p className="text-gray-600">Connect with like-minded individuals in a friendly and supportive community environment.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Property types grid */}
      <section className="py-16 bg-[#F8F8F8] px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-italiana text-4xl md:text-5xl text-center mb-12">Find Your Space</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Boys Hostel */}
            <motion.div 
              className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              onClick={() => handleRoleSelection('user')}
            >
              <img src={m2} alt="Boys Hostel" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-2xl font-medium mb-2">Boys Hostel</h3>
                  <p className="text-white/80 mb-4">Modern accommodations designed for male students and professionals</p>
                  <motion.button 
                    className="text-white font-medium flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    Explore options
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            {/* Girls Hostel */}
            <motion.div 
              className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={() => handleRoleSelection('user')}
            >
              <img src={main_pic_1} alt="Girls Hostel" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-2xl font-medium mb-2">Girls Hostel</h3>
                  <p className="text-white/80 mb-4">Safe and comfortable spaces for female students and professionals</p>
                  <motion.button 
                    className="text-white font-medium flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    Explore options
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA for property owners */}
      <section className="py-20 bg-[#384f95] text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-italiana text-4xl md:text-5xl mb-6">Own a Property?</h2>
          <p className="text-lg md:text-xl mb-10 text-white/90">
            List your hostel or PG on our platform and connect with potential tenants looking for quality accommodations.
          </p>
          <motion.button
            onClick={() => handleRoleSelection('provider')}
            className="px-8 py-4 bg-white text-[#384f95] font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            List Your Property
          </motion.button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="font-italiana text-3xl mb-4">MySpace</h3>
              <p className="text-gray-400 max-w-xs">
                Your trusted platform for finding the perfect accommodations that feel like home.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">For Users</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => handleRoleSelection('user')} className="hover:text-white transition-colors">Find Accommodation</button></li>
                  <li><button className="hover:text-white transition-colors">How It Works</button></li>
                  <li><button className="hover:text-white transition-colors">FAQs</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">For Providers</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => handleRoleSelection('provider')} className="hover:text-white transition-colors">List Property</button></li>
                  <li><button className="hover:text-white transition-colors">Owner Dashboard</button></li>
                  <li><button className="hover:text-white transition-colors">Resources</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button className="hover:text-white transition-colors">About Us</button></li>
                  <li><button className="hover:text-white transition-colors">Contact</button></li>
                  <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} MySpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
