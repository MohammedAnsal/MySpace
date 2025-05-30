import React from 'react';
import { motion } from 'framer-motion';

export const OurMission = () => {
  return (
    <section className="py-16 px-4 bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-italiana text-3xl md:text-4xl mb-4">Our Mission</h2>
          <p className="font-dm_sans text-lg text-gray-700 max-w-3xl mx-auto">
            To provide exceptional living experiences by connecting quality accommodation providers with individuals seeking their ideal home away from home.
          </p>
        </motion.div>
        {/* Mission Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Value components here */}
        </div>
      </div>
    </section>
  );
}; 