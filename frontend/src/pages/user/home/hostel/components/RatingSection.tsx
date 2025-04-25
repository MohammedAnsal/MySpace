import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, User, ChevronUp, ChevronDown } from "lucide-react";
import RatingStars from "@/components/global/RatingStars";

interface RatingSectionProps {
  ratingData: any;
  isLoading: boolean;
}

const RatingSection: React.FC<RatingSectionProps> = ({
  ratingData,
  isLoading,
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (isLoading) {
    return (
      <div className="animate-pulse h-20 bg-gray-100 rounded-md mt-8"></div>
    );
  }

  if (!ratingData || !ratingData.ratings || ratingData.ratings.length === 0) {
    return null;
  }

  const visibleReviews = showAllReviews
    ? ratingData.ratings
    : ratingData.ratings.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-sm p-6 mt-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl font-semibold mb-6 flex items-center border-b pb-4"
      >
        <Star className="w-6 h-6 text-amber-500 mr-2" />
        Ratings & Reviews ({ratingData.totalRatings || 0})
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Rating summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[#384f9514] rounded-lg p-6"
          >
            <div className="flex flex-col items-center mb-6">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-5xl font-bold text-gray-800"
              >
                {ratingData.averageRating?.toFixed(1) || "0.0"}
              </motion.span>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="my-2"
              >
                <RatingStars rating={ratingData.averageRating || 0} size={28} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-sm text-gray-600"
              >
                Based on {ratingData.totalRatings || 0}{" "}
                {ratingData.totalRatings === 1 ? "review" : "reviews"}
              </motion.div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star, idx) => {
                const count = ratingData.ratings.filter(
                  (r: any) => Math.round(r.rating) === star
                ).length;
                const percentage = ratingData.totalRatings
                  ? (count / ratingData.totalRatings) * 100
                  : 0;

                return (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 text-sm text-gray-600 font-medium">
                      {star}
                    </div>
                    <Star className="w-4 h-4 text-amber-500" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right side - Reviews list */}
        <div className="lg:col-span-2">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-lg font-medium text-gray-800 mb-4"
          >
            Customer Reviews
          </motion.h3>

          <div className="space-y-6">
            {visibleReviews.map((rating: any, index: number) => (
              <motion.div
                key={rating._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 border border-gray-200">
                    {rating.user_id?.profile_picture ? (
                      <img
                        src={rating.user_id.profile_picture}
                        alt={rating.user_id?.fullName || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-main-color/10 w-full h-full flex items-center justify-center">
                        <User size={20} className="text-main-color" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-gray-900 text-lg">
                        {rating.user_id?.fullName || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(rating.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 mb-3">
                      <RatingStars
                        rating={rating.rating}
                        size={18}
                        showText={false}
                      />
                      <span className="ml-2 text-amber-500 font-medium text-sm">
                        {rating.rating.toFixed(1)}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {rating.comment}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {ratingData.ratings.length > 3 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-6 text-sm w-full py-3 border border-main-color text-main-color hover:bg-main-color hover:text-white rounded-lg transition-colors duration-300 font-medium flex items-center justify-center"
            >
              {showAllReviews ? (
                <>
                  <ChevronUp size={16} className="mr-1" /> Show less
                </>
              ) : (
                <>
                  Show all {ratingData.ratings.length} reviews{" "}
                  <ChevronDown size={16} className="ml-1" />
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RatingSection;
