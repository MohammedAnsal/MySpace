import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { MenuItem } from "../Food";
import {
  useMenuItems,
  useAddSingleDayMenu,
  useFoodMenu,
  useDeleteFoodMenu,
} from "@/hooks/provider/facility/useFacility";
import { toast } from "sonner";
import Modal from "@/components/global/Modal";

interface DayMealCardProps {
  day: string;
  facilityId: string;
  hostelId: string;
}

export const DayMealCard = ({
  facilityId,
  hostelId,
  day,
}: DayMealCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<
    "Breakfast" | "Lunch" | "Dinner" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    itemId: string;
    mealType: "morning" | "noon" | "night";
    itemName: string;
  } | null>(null);

  const itemsPerPage = 2; // Number of items per page in selection modal

  // Add new state for meal display pagination
  const [mealPages, setMealPages] = useState<Record<string, number>>({
    morning: 1,
    noon: 1,
    night: 1,
  });
  const mealsPerPage = 2; // Show 4 meals per page

  // Get menu items
  const { data: menuItems = [], isLoading: isLoadingItems } = useMenuItems();

  // Get food menu
  const { data: foodMenu, isLoading: isLoadingMenu } = useFoodMenu(
    facilityId,
    hostelId
  );

  // Add day menu mutation
  const addDayMenu = useAddSingleDayMenu();

  // Get meals for current day
  const dayMenu = foodMenu?.menu?.find((menu) => menu.day === day);

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

  const isCurrentDay = day === getCurrentDay();

  const handleAddItems = (mealType: "Breakfast" | "Lunch" | "Dinner") => {
    setSelectedMeal(mealType);
    setError(null);
  };

  //  Handle Add MenuMeal :-

  const handleSelectItem = async (item: MenuItem) => {
    try {
      const mealTypeMap = {
        Breakfast: "morning",
        Lunch: "noon",
        Dinner: "night",
      };

      const mealType = mealTypeMap[selectedMeal!];
      // Get existing items for this meal type
      const existingItems =
        dayMenu?.meals[mealType as keyof typeof dayMenu.meals]?.items || [];

      // Add the new item
      const updatedItems = [...existingItems, item._id];

      await addDayMenu.mutateAsync({
        facilityId,
        hostelId,
        day,
        meals: {
          [mealType]: updatedItems,
        },
      });

      toast.success(`${selectedMeal} item added successfully`);
      setSelectedMeal(null);
    } catch (error) {
      toast.error("Failed to add menu item");
      setError("Failed to add menu item. Please try again.");
    }
  };

  //  Remove Menu :-

  const deleteMenu = useDeleteFoodMenu();

  const handleRemoveMealInMenu = async (
    itemId: string,
    foodMenuId: string,
    mealType: "morning" | "noon" | "night"
  ) => {
    try {
      await deleteMenu.mutateAsync({
        id: itemId,
        foodMenuId,
        day,
        mealType,
      });
      toast.success("Menu item removed successfully");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to remove menu item");
    }
  };

  // Calculate pagination for menu items:-

  const getCurrentPageItems = () => {
    if (!menuItems) return [];
    const filteredItems = menuItems.filter(
      (item) => item.category === selectedMeal
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = menuItems
    ? Math.ceil(
        menuItems.filter((item) => item.category === selectedMeal).length /
          itemsPerPage
      )
    : 0;

  const renderMealSection = (title: "Breakfast" | "Lunch" | "Dinner") => {
    const mealTypeMap = {
      Breakfast: "morning",
      Lunch: "noon",
      Dinner: "night",
    };

    const mealType = mealTypeMap[title] as "morning" | "noon" | "night";
    const mealData = dayMenu?.meals?.[mealType];
    // Check if meal is available
    const isAvailable = mealData?.isAvailable !== false; // Default to true if undefined
    const allItems = mealData?.items || [];

    // Calculate pagination for displayed meals
    const currentPage = mealPages[mealType];
    const startIndex = (currentPage - 1) * mealsPerPage;
    const items = allItems.slice(startIndex, startIndex + mealsPerPage);
    const totalPages = Math.ceil(allItems.length / mealsPerPage);

    const handlePageChange = (direction: "prev" | "next") => {
      setMealPages((prev) => ({
        ...prev,
        [mealType]:
          direction === "prev"
            ? Math.max(1, prev[mealType] - 1)
            : Math.min(totalPages, prev[mealType] + 1),
      }));
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-700">{title}</h4>
            {!isAvailable && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                Cancelled
              </span>
            )}
          </div>
          {items.length === 0 && (
            <button
              onClick={() => handleAddItems(title)}
              className="flex items-center px-2 py-1 text-amber-500 hover:text-amber-600 rounded-md 
              hover:bg-amber-50 transition-colors text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Meal
            </button>
          )}
        </div>

        {!isAvailable && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-2">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1.5" />
              <p className="text-xs text-red-600">
                This meal has been cancelled by user
              </p>
            </div>
          </div>
        )}

        <div
          className={`${
            !isAvailable
              ? "bg-red-50 border-red-100"
              : "bg-gray-50 border-gray-100"
          } rounded-lg border`}
        >
          {isLoadingMenu ? (
            <div className="p-3">
              <p className="text-xs text-gray-500">Loading meals...</p>
            </div>
          ) : items && items.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {items.map((item: any) => (
                  <div
                    key={item._id}
                    className="p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-200"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          show: true,
                          itemId: item._id,
                          mealType,
                          itemName: item.name,
                        })
                      }
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Meal Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-2 border-t border-gray-100">
                  <button
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-gray-500">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-3">
              <p className="text-xs text-gray-500">No meal selected</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-gray-800">{day}</h3>
            {isCurrentDay && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                Today
              </span>
            )}

            {/* Show if any meal is cancelled in this day */}
            {dayMenu &&
              ["morning", "noon", "night"].some(
                (mealType) =>
                  dayMenu.meals[mealType as keyof typeof dayMenu.meals]
                    ?.isAvailable === false
              ) && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                  Has cancellations
                </span>
              )}
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </div>

        {isExpanded && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {renderMealSection("Breakfast")}
            {renderMealSection("Lunch")}
            {renderMealSection("Dinner")}
          </div>
        )}
      </div>

      {/* Item Selection Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select {selectedMeal} for {day}
                </h3>
                <button
                  onClick={() => {
                    setSelectedMeal(null);
                    setError(null);
                    setCurrentPage(1);
                  }}
                  className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-700">
                  <AlertCircle size={16} className="mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {isLoadingItems ? (
                <div className="text-center py-8">
                  <p>Loading menu items...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {getCurrentPageItems().map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelectItem(item)}
                        className="group flex flex-col border border-gray-200 rounded-xl 
                        hover:border-amber-500 cursor-pointer transition-all hover:shadow-md"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded-t-xl"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-800">
                              {item.name}
                            </h4>
                            <span className="p-2 rounded-full bg-amber-50 group-hover:bg-amber-100 transition-colors">
                              <Plus size={16} className="text-amber-500" />
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm?.show}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to remove {deleteConfirm?.itemName} from this
            meal?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                deleteConfirm &&
                handleRemoveMealInMenu(
                  String(foodMenu?._id),
                  deleteConfirm.itemId,
                  deleteConfirm.mealType
                )
              }
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
