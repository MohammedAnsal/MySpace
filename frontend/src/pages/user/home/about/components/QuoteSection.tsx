import React from 'react';
import { motion } from 'framer-motion';

export const QuoteSection = () => {
  return (
    <section className="py-16 px-4 bg-[#384f95] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl font-serif mb-6">"</div>
          <p className="text-xl md:text-2xl font-dm_sans italic mb-6">
            We believe that everyone deserves a place that feels like home, regardless of where life takes them. Our mission is to create those spaces and foster communities where memories are made.
          </p>
          <p className="font-medium">— John Doe, Founder</p>
        </motion.div>
      </div>
    </section>
  );
}; 