import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#384f95] text-white px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-italiana text-4xl md:text-5xl mb-6"
        >
          Find Your Ideal Stay
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl mb-10 text-white/90"
        >
          Explore our full collection of quality accommodations designed for your comfort and convenience.
        </motion.p>
        <motion.button
          onClick={() => navigate('/accommodations')}
          className="px-8 py-4 bg-white text-[#384f95] font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          View All Accommodations
        </motion.button>
      </div>
    </section>
  );
};

export default CTASection; 