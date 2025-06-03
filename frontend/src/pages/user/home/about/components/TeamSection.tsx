import { motion } from 'framer-motion';

export const TeamSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-italiana text-3xl md:text-4xl mb-4">Our Team</h2>
          <p className="font-dm_sans text-lg text-gray-700 max-w-3xl mx-auto">
            Meet the dedicated professionals behind MySpace who work tirelessly to ensure we deliver the best accommodation options for our users.
          </p>
        </motion.div>
        {/* Team members grid */}
      </div>
    </section>
  );
}; 