import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const FAQSection = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book a hostel?",
      answer: "You can book a hostel by browsing our listings, selecting your desired hostel, and clicking the 'Book Now' button. Follow the prompts to complete your reservation.",
      color: "B58C5F",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and net banking. All payments are secure and encrypted.",
      color: "384f95",
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking according to the cancellation policy of each hostel. Most hostels allow free cancellation up to 24-48 hours before check-in.",
      color: "B58C5F",
    },
    {
      question: "Do you offer monthly stays?",
      answer: "Yes, many of our hostels offer monthly rental options. You can filter for long-term stays in our search option.",
      color: "384f95",
    },
    {
      question: "What amenities are typically included?",
      answer: "Common amenities include Wi-Fi, housekeeping, common areas, kitchen facilities, and 24/7 security. Specific amenities vary by hostel and can be found in the listing details.",
      color: "B58C5F",
    },
  ];

  return (
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
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              color={faq.color}
              isActive={activeFaq === index}
              onClick={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer, color, isActive, onClick }: { question: string; answer: string; color: string; isActive: boolean; onClick: () => void }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="cursor-pointer" onClick={onClick}>
      <div className={`p-6 border-l-4 border-[#${color}] transition-all duration-300 hover:bg-gray-50`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#B58C5F]">
            {question}
          </h3>
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-[#${color}] bg-opacity-10 p-2 rounded-full text-[#${color}]`}
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
            height: isActive ? "auto" : 0,
            opacity: isActive ? 1 : 0,
            marginTop: isActive ? 16 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </motion.div>
      </div>
    </div>
  </motion.div>
); 