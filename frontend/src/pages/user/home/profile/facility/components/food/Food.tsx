import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UtensilsCrossed, Clock, Calendar, ChevronRight, ChefHat } from "lucide-react";
import WeeklyMenu from "./WeeklyMenu";
import { useFoodMenu } from "@/hooks/user/useUserQueries";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  _id: string;
  name: string;
  image: string;
}

interface MealType {
  isAvailable: boolean;
  items: MenuItem[];
}

interface DayMenu {
  day: string;
  meals: {
    morning: MealType;
    noon: MealType;
    night: MealType;
  };
}

interface FoodMenuData {
  _id: string;
  facilityId: string;
  hostelId: string;
  providerId: string;
  menu: DayMenu[];
  createdAt: string;
  updatedAt: string;
}

const Food = () => {
  const { facilityId, hostelId } = useParams();
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const { data: menuData, isLoading, refetch } = useFoodMenu(facilityId!, hostelId!);

  // Force refetch on component mount to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const getCurrentDayMenu = () => {
    if (!menuData) return null;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[new Date().getDay()];
    return menuData.menu.find((day: DayMenu) => day.day === currentDay);
  };

  const currentDayMenu = getCurrentDayMenu();

  const renderMealItems = (items: MenuItem[], isAvailable: boolean) => {
    if (!isAvailable) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 italic bg-gray-50 p-4 rounded-lg text-center"
        >
          Not available today
        </motion.div>
      );
    }

    if (items.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 italic bg-gray-50 p-4 rounded-lg text-center"
        >
          No items available
        </motion.div>
      );
    }

    return (
      <motion.ul 
        className="space-y-3"
        variants={cardVariants}
        initial="initial"
        animate="animate"
      >
        {items.map((item) => (
          <motion.li 
            key={item._id} 
            variants={menuItemVariants}
            className="flex items-center space-x-4 bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover ring-2 ring-[#f7f4f1]"
            />
            <div className="flex-1">
              <h4 className="text-sm sm:text-base text-gray-900 font-medium">{item.name}</h4>
              <p className="text-xs sm:text-sm text-gray-500">Freshly prepared</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 rounded-2xl overflow-hidden shadow-lg mt-4 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Premium Header */}
        <motion.div
          variants={cardVariants}
          className="bg-gradient-to-r from-[#b9a089] to-[#d4c4b3] rounded-2xl shadow-xl mb-6 sm:mb-8 overflow-hidden"
        >
          <div className="p-4 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ChefHat className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold">Catering Service</h1>
                  <p className="text-white/80 text-sm sm:text-base mt-1">
                    Experience culinary excellence
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWeeklyMenu(true)}
                className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm sm:text-base"
              >
                View Weekly Menu
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Meal Timings Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-[#f7f4f1] rounded-lg">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#b9a089]" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Meal Timings
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { meal: "Breakfast", time: "7:00 AM - 9:00 AM" },
                  { meal: "Lunch", time: "12:30 PM - 2:30 PM" },
                  { meal: "Dinner", time: "7:30 PM - 9:30 PM" },
                ].map((timing, index) => (
                  <motion.div
                    key={timing.meal}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl"
                  >
                    <span className="text-sm sm:text-base text-gray-700 font-medium">
                      {timing.meal}
                    </span>
                    <span className="text-xs sm:text-sm text-[#b9a089] font-semibold">
                      {timing.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Today's Menu Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#f7f4f1] rounded-lg">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#b9a089]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Today's Menu
                  </h2>
                </div>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#f7f4f1] text-[#b9a089] rounded-lg text-xs sm:text-sm font-medium">
                  {currentDayMenu?.day || "Loading..."}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 sm:py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#b9a089] mx-auto"
                    />
                    <p className="text-sm sm:text-base text-gray-500 mt-4">Loading today's menu...</p>
                  </motion.div>
                ) : !menuData ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 sm:py-8"
                  >
                    <div className="p-3 sm:p-4 bg-[#f7f4f1] rounded-xl inline-block mb-3 sm:mb-4">
                      <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-[#b9a089]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      No Menu Available
                    </h3>
                    <p className="text-sm text-gray-500">
                      The food menu hasn't been set up yet.
                    </p>
                  </motion.div>
                ) : currentDayMenu ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {["morning", "noon", "night"].map((mealTime, index) => (
                      <motion.div
                        key={mealTime}
                        variants={menuItemVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2 sm:space-y-3"
                      >
                        <h3 className="text-sm sm:text-base font-medium text-[#b9a089] flex items-center">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#b9a089] rounded-full mr-2"></span>
                          {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
                        </h3>
                        {renderMealItems(
                          currentDayMenu.meals[
                            mealTime as keyof typeof currentDayMenu.meals
                          ].items,
                          currentDayMenu.meals[
                            mealTime as keyof typeof currentDayMenu.meals
                          ].isAvailable
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Weekly Menu Modal */}
      <AnimatePresence>
        {showWeeklyMenu && (
          <WeeklyMenu
            facilityId={facilityId || ""}
            onClose={() => setShowWeeklyMenu(false)}
            menuData={menuData}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Food;
