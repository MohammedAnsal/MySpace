import { motion } from "framer-motion";
import m1 from "@/assets/user/m1.jpg";

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection; 