import React from 'react';
import { motion } from 'framer-motion';
import m1 from "../../../../../assets/user/m1.jpg";

export const HeroSection = () => {
  return (
    <section className="relative h-[50vh] md:h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <img src={m1} alt="Contact us" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
        <motion.h1
          className="font-italiana text-4xl md:text-6xl lg:text-7xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact Us
        </motion.h1>
        <motion.p
          className="font-dm_sans text-lg md:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We're here to help with any questions about our hostels, bookings, or services
        </motion.p>
      </div>
    </section>
  );
}; 