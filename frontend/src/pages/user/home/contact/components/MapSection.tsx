import { motion } from 'framer-motion';

export const MapSection = () => {
  return (
    <section className="py-16 px-4 bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-italiana text-3xl md:text-4xl mb-4">Our Location</h2>
          <p className="font-dm_sans text-gray-700">
            Visit our office to learn more about our services
          </p>
        </motion.div>

        <motion.div
          className="rounded-xl overflow-hidden shadow-lg h-[400px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.238876216313!2d76.30672491479077!3d9.998389692850358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d08f976f3a9%3A0xe9cdb444f06ed454!2sErnakulam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1648456015757!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MySpace Office Location"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}; 