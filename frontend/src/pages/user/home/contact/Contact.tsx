import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../../../components/layouts/Navbar';
import Footer from '../../../../components/layouts/Footer';
import m1 from "../../../../assets/user/m1.jpg";
import Scroll from '@/components/global/Scroll';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E2E1DF]">
        {/* Hero Section - Updated to match About page */}
        <section className="relative h-[50vh] md:h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={m1}
              alt="Contact us"
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
              Contact Us
            </motion.h1>

            <motion.p
              className="font-dm_sans text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We're here to help with any questions about our hostels, bookings,
              or services
            </motion.p>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="font-italiana text-3xl md:text-4xl mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-8 font-dm_sans">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#B58C5F] flex items-center justify-center text-white flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-gray-900">
                        Phone
                      </h3>
                      <p className="text-gray-700">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#384f95] flex items-center justify-center text-white flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-gray-900">
                        Email
                      </h3>
                      <p className="text-gray-700">contact@myspace.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#B58C5F] flex items-center justify-center text-white flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-gray-900">
                        Address
                      </h3>
                      <p className="text-gray-700">
                        123 Main Street, Kochi, Kerala, India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#384f95] flex items-center justify-center text-white hover:bg-[#2d3f75] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#B58C5F] flex items-center justify-center text-white hover:bg-[#a07a4f] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-[#384f95] flex items-center justify-center text-white hover:bg-[#2d3f75] transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#B58C5F] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#384f95] opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <h2 className="font-italiana text-2xl md:text-3xl mb-8 relative">
                  Send us a Message
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#B58C5F]"></div>
                </h2>

                {submitSuccess ? (
                  <motion.div
                    className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Thank you! Your message has been sent successfully.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label
                          htmlFor="name"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Your Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58C5F] focus:border-[#B58C5F] outline-none transition-all duration-300 pl-10"
                            required
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label
                          htmlFor="email"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58C5F] focus:border-[#B58C5F] outline-none transition-all duration-300 pl-10"
                            required
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label
                        htmlFor="subject"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Subject
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58C5F] focus:border-[#B58C5F] outline-none transition-all duration-300 pl-10 appearance-none bg-white"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="bookings">Bookings</option>
                          <option value="properties">Property Listing</option>
                          <option value="support">Technical Support</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label
                        htmlFor="message"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Your Message
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58C5F] focus:border-[#B58C5F] outline-none transition-all duration-300 pl-10"
                          required
                        ></textarea>
                        <div className="absolute left-3 top-6 text-gray-400">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      type="submit"
                      className="w-full px-6 py-4 bg-[#B58C5F] text-white font-medium rounded-lg shadow-md hover:bg-[#a07a4f] transition-all duration-300 flex justify-center items-center relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg
                            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 px-4 bg-[#F8F8F8]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-italiana text-3xl md:text-4xl mb-4">
                Our Location
              </h2>
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

        {/* Updated FAQ Section */}
        <section className="py-16 px-4 bg-[#F8F8F8]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-italiana text-3xl md:text-4xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="font-dm_sans text-lg text-gray-700">
                Find quick answers to common questions about our services
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "How do I book a hostel?",
                  answer:
                    "You can book a hostel by browsing our listings, selecting your desired hostel, and clicking the 'Book Now' button. Follow the prompts to complete your reservation.",
                  color: "B58C5F",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, debit cards, UPI, and net banking. All payments are secure and encrypted.",
                  color: "384f95",
                },
                {
                  question: "Can I cancel my booking?",
                  answer:
                    "Yes, you can cancel your booking according to the cancellation policy of each hostel. Most hostels allow free cancellation up to 24-48 hours before check-in.",
                  color: "B58C5F",
                },
                {
                  question: "Do you offer monthly stays?",
                  answer:
                    "Yes, many of our hostels offer monthly rental options. You can filter for long-term stays in our search option.",
                  color: "384f95",
                },
                {
                  question: "What amenities are typically included?",
                  answer:
                    "Common amenities include Wi-Fi, housekeeping, common areas, kitchen facilities, and 24/7 security. Specific amenities vary by hostel and can be found in the listing details.",
                  color: "B58C5F",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleFaq(index)}
                  >
                    <div
                      className={`p-6 border-l-4 border-[#${faq.color}] transition-all duration-300 hover:bg-gray-50`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#B58C5F]">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: activeFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`bg-[#${faq.color}] bg-opacity-10 p-2 rounded-full text-[#${faq.color}]`}
                        >
                          <svg
                            fill="none"
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="transition-transform duration-300"
                          >
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={false}
                        animate={{
                          height: activeFaq === index ? "auto" : 0,
                          opacity: activeFaq === index ? 1 : 0,
                          marginTop: activeFaq === index ? 16 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}
