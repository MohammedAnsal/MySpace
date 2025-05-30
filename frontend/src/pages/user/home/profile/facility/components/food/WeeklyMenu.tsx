import { X, ChevronDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cancelMeal } from "@/services/Api/userApi";

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

interface WeeklyMenuProps {
  onClose: () => void;
  menuData: {
    _id: string;
    hostelId: string;
    menu: DayMenu[];
  } | null;
}

const WeeklyMenu = ({ onClose, menuData }: WeeklyMenuProps) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  // const { refetch } = useFoodMenu(facilityId, menuData?.hostelId || "");

  // Add a new state to manage the menu data locally
  const [localMenuData, setLocalMenuData] = useState(menuData);

  // Update localMenuData when menuData prop changes
  useEffect(() => {
    setLocalMenuData(menuData);
  }, [menuData]);

  // Get current day of the week
  const getCurrentDay = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  // Auto-expand the current day when the menu is opened
  useEffect(() => {
    setExpandedDay(currentDay);
  }, [currentDay]);

  const handleMealToggle = async (
    day: string,
    mealTime: string,
    currentStatus: boolean
  ) => {
    if (!localMenuData?._id) {
      toast.error("Menu information is missing");
      return;
    }

    // Don't allow toggling current day's meals
    if (day === currentDay) {
      toast.error("Cannot cancel or restore meals for today");
      return;
    }

    const loadingKey = `${day}-${mealTime}`;
    setIsLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await cancelMeal(
        localMenuData._id,
        day,
        mealTime,
        !currentStatus
      );

      if (response.status === "success") {
        // Update the local state instead of refetching
        setLocalMenuData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            menu: prev.menu.map((dayMenu) => {
              if (dayMenu.day === day) {
                return {
                  ...dayMenu,
                  meals: {
                    ...dayMenu.meals,
                    [mealTime]: {
                      ...dayMenu.meals[mealTime as keyof typeof dayMenu.meals],
                      isAvailable: !currentStatus,
                    },
                  },
                };
              }
              return dayMenu;
            }),
          };
        });

        toast.success(
          `${mealTime} for ${day} has been ${
            currentStatus ? "cancelled" : "restored"
          }`
        );
      } else {
        toast.error(response.message || "Failed to update meal");
      }
    } catch (error) {
      toast.error("Failed to update meal availability");
      console.error(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const renderMealItems = (
    items: MenuItem[],
    isAvailable: boolean,
    day: string,
    mealTime: string
  ) => {
    const loadingKey = `${day}-${mealTime}`;
    const isCurrentlyLoading = isLoading[loadingKey];

    if (isCurrentlyLoading) {
      return (
        <div className="text-gray-500 italic bg-gray-50 p-3 rounded-lg flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-[#b9a089] border-t-transparent rounded-full mr-2"
          />
          Updating...
        </div>
      );
    }

    if (!isAvailable) {
      return (
        <div className="text-red-100 italic bg-red-50 p-3 rounded-lg border border-red-100">
          <div className="flex items-center justify-center text-red-500">
            <X className="h-4 w-4 mr-2" />
            <span>Meal cancelled for this time</span>
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-gray-500 italic bg-gray-50 p-3 rounded-lg">
          No items available
        </div>
      );
    }

    return (
      <motion.ul
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {items.map((item) => (
          <motion.li
            key={item._id}
            className="flex items-center space-x-3 bg-white p-2 rounded-lg shadow-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <span className="text-gray-700 font-medium">{item.name}</span>
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-gray-900">Weekly Menu</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        </div>

        <div className="p-4 border-b border-gray-200 bg-amber-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm text-amber-700">
                <span className="font-medium">Note:</span> You can only cancel
                or restore meals for future days. Today's meals ({currentDay})
                cannot be modified.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
          <div className="space-y-4">
            {days.map((day) => {
              const dayMenu = localMenuData?.menu.find((m) => m.day === day);
              const isExpanded = expandedDay === day;
              const isCurrentDay = day === currentDay;

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border border-gray-200 rounded-xl overflow-hidden ${
                    isCurrentDay ? "border-amber-300" : ""
                  }`}
                >
                  <motion.button
                    whileHover={{
                      backgroundColor: isCurrentDay ? "#fff8e1" : "#f7f4f1",
                    }}
                    onClick={() => setExpandedDay(isExpanded ? null : day)}
                    className={`w-full p-4 flex items-center justify-between ${
                      isCurrentDay ? "bg-amber-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`text-lg font-semibold ${
                          isCurrentDay ? "text-amber-700" : "text-[#b9a089]"
                        }`}
                      >
                        {day}
                      </h3>
                      {isCurrentDay && (
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown
                        className={`h-5 w-5 ${
                          isCurrentDay ? "text-amber-600" : "text-[#b9a089]"
                        }`}
                      />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && dayMenu && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                          {["morning", "noon", "night"].map((mealTime) => {
                            const meal =
                              dayMenu.meals[
                                mealTime as keyof typeof dayMenu.meals
                              ];

                            return (
                              <div key={mealTime} className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900 flex items-center">
                                    <span className="w-2 h-2 bg-[#b9a089] rounded-full mr-2"></span>
                                    {mealTime.charAt(0).toUpperCase() +
                                      mealTime.slice(1)}
                                  </h4>
                                  <button
                                    onClick={() =>
                                      handleMealToggle(
                                        day,
                                        mealTime,
                                        meal.isAvailable
                                      )
                                    }
                                    disabled={
                                      isCurrentDay ||
                                      isLoading[`${day}-${mealTime}`]
                                    }
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                      isCurrentDay
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : meal.isAvailable
                                        ? "bg-[#f7f4f1] text-[#b9a089] hover:bg-[#f0ebe7]"
                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                                  >
                                    {isCurrentDay
                                      ? "Cannot Modify"
                                      : meal.isAvailable
                                      ? "Cancel"
                                      : "Restore"}
                                  </button>
                                </div>
                                {renderMealItems(
                                  meal.items,
                                  meal.isAvailable,
                                  day,
                                  mealTime
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeeklyMenu;
