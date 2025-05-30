import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#B58C5F] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#384f95] opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <h2 className="font-italiana text-2xl md:text-3xl mb-8 relative">
        Send us a Message
        <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#B58C5F]"></div>
      </h2>

      {submitSuccess ? (
        <SuccessMessage />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              type="text"
              name="name"
              label="Your Name"
              value={formData.name}
              onChange={handleChange}
              icon={<UserIcon />}
            />
            <FormInput
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              icon={<EmailIcon />}
            />
          </div>

          <FormSelect
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleChange}
            icon={<SubjectIcon />}
          />

          <FormTextarea
            name="message"
            label="Your Message"
            value={formData.message}
            onChange={handleChange}
            icon={<MessageIcon />}
          />

          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      )}
    </motion.div>
  );
};

// Sub-components
const SuccessMessage = () => (
  <motion.div
    className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-green-800">
          Thank you! Your message has been sent successfully.
        </p>
      </div>
    </div>
  </motion.div>
);

const FormInput = ({ type, name, label, value, onChange, icon }: { type: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58C5F] focus:border-[#B58C5F] outline-none transition-all duration-300 pl-10"
        required
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    </div>
  </motion.div>
);

const FormSelect = ({ name, label, value, onChange, icon }: { name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
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
        {icon}
      </div>
    </div>
  </motion.div>
);

const FormTextarea = ({ name, label, value, onChange, icon }: { name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
      {label}
    </label>
    <div className="relative">
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={5}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58C5F] focus:border-[#B58C5F] outline-none transition-all duration-300 pl-10"
        required
      ></textarea>
      <div className="absolute left-3 top-6 text-gray-400">
        {icon}
      </div>
    </div>
  </motion.div>
);

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
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
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      </>
    ) : (
      <>
        Send Message
        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </>
    )}
  </motion.button>
);

// Icon Components
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SubjectIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
); 