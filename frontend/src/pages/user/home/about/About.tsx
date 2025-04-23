import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../../../components/layouts/Navbar';
import Footer from '../../../../components/layouts/Footer';
import m1 from "../../../../assets/user/m1.jpg";
import m2 from "../../../../assets/user/m2.jpg";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E2E1DF]">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={m1}
              alt="Hostel interior"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
            <motion.h1 
              className="font-italiana text-4xl md:text-6xl lg:text-7xl mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About MySpace
            </motion.h1>
            
            <motion.p 
              className="font-dm_sans text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Creating comfortable homes away from home
            </motion.p>
          </div>
        </section>

        {/* Our Story Section */}
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
                  <p>
                    Founded in 2023, MySpace began with a simple mission: to create comfortable, 
                    safe, and affordable living spaces for students and young professionals.
                  </p>
                  <p>
                    We understand the challenges of finding the right accommodation that balances 
                    quality, affordability, and community. Our founder experienced these struggles 
                    firsthand as a student, which inspired the creation of MySpace.
                  </p>
                  <p>
                    What started as a small collection of properties has grown into a trusted 
                    platform connecting quality hostels with individuals seeking their ideal living space.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                className="rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <img 
                  src={m2} 
                  alt="Comfortable hostel room" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
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
                To provide exceptional living experiences by connecting quality accommodation 
                providers with individuals seeking their ideal home away from home.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 mb-4 rounded-full bg-[#B58C5F] flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">We believe in fostering connections and creating environments where lasting friendships can flourish.</p>
              </motion.div>
              
              {/* Value 2 */}
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
                <h3 className="text-xl font-semibold mb-2">Safety & Trust</h3>
                <p className="text-gray-600">We prioritize the safety and well-being of our users through thorough verification and transparent processes.</p>
              </motion.div>
              
              {/* Value 3 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 mb-4 rounded-full bg-[#B58C5F] flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Living</h3>
                <p className="text-gray-600">We are committed to maintaining high standards in all our listed accommodations for an exceptional living experience.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
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
                Meet the dedicated professionals behind MySpace who work tirelessly to ensure 
                we deliver the best accommodation options for our users.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Team Member 1 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#B58C5F]">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                <p className="text-[#B58C5F] font-medium">Founder & CEO</p>
              </motion.div>

              {/* Team Member 2 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#384f95]">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Jane Smith</h3>
                <p className="text-[#384f95] font-medium">Operations Manager</p>
              </motion.div>

              {/* Team Member 3 */}
              {/* <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#B58C5F]">
                  <img 
                    src="https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">David Wilson</h3>
                <p className="text-[#B58C5F] font-medium">Property Manager</p>
              </motion.div> */}

              {/* Team Member 4 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#384f95]">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
                <p className="text-[#384f95] font-medium">Customer Support</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
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
                We believe that everyone deserves a place that feels like home, regardless of where life takes them. 
                Our mission is to create those spaces and foster communities where memories are made.
              </p>
              <p className="font-medium">— John Doe, Founder</p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
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
                Whether you're looking for a place to stay or have a property to list, 
                MySpace is here to help you find the perfect match.
              </p>
              <motion.button
                className="px-8 py-4 bg-[#B58C5F] text-white font-medium rounded-lg shadow-lg hover:bg-[#a07a4f] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/accommodations'}
              >
                Explore Accommodations
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
