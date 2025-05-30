import React from 'react';
import { motion } from 'framer-motion';

export const CTASection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-italiana text-3xl md:text-4xl mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto font-dm_sans text-gray-700">
            Whether you're looking for a place to stay or have a property to list, MySpace is here to help you find the perfect match.
          </p>
          <motion.button
            className="px-8 py-4 bg-[#B58C5F] text-white font-medium rounded-lg shadow-lg hover:bg-[#a07a4f] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/accommodations")}
          >
            Explore Accommodations
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}; 