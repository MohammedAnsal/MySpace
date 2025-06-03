import { motion } from 'framer-motion';
import m2 from "../../../../../assets/user/m2.jpg";

export const OurStory = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-italiana text-3xl md:text-4xl mb-6">Our Story</h2>
            <div className="space-y-4 font-dm_sans text-gray-700">
              <p>Founded in 2023, MySpace began with a simple mission: to create comfortable, safe, and affordable living spaces for students and young professionals.</p>
              <p>We understand the challenges of finding the right accommodation that balances quality, affordability, and community. Our founder experienced these struggles firsthand as a student, which inspired the creation of MySpace.</p>
              <p>What started as a small collection of properties has grown into a trusted platform connecting quality hostels with individuals seeking their ideal living space.</p>
            </div>
          </motion.div>
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img src={m2} alt="Comfortable hostel room" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 