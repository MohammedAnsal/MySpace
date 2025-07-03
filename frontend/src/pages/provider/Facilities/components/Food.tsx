import { Key, useState } from "react";
import { WeeklyMenu } from "./food/WeeklyMenu";
import { MenuItemForm } from "./food/MenuItemForm";
import {
  Plus,
  UtensilsCrossed,
  Search,
  Calendar,
  X,
  Trash2,
} from "lucide-react";
import {
  useMenuItems,
  useDeleteMenuItem,
} from "@/hooks/provider/facility/useFacility";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import Modal from "@/components/global/Modal";

// Demo data for menu items
export interface MenuItem {
  _id: Key | null | undefined;
  name: string;
  description: string;
  category: "Breakfast" | "Lunch" | "Dinner";
  image: string;
}

// Add this new component at the top of the file
interface MenuItemDetailsModalProps {
  item: MenuItem;
  onClose: () => void;
  onDelete: () => void;
}

const MenuItemDetailsModal = ({
  item,
  onClose,
  onDelete,
}: MenuItemDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition-colors"
                title="Delete menu item"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-cover rounded-lg ring-1 ring-gray-200"
            />

            <div>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-sm 
                font-medium bg-amber-50 text-amber-700"
              >
                {item.category}
              </span>
            </div>

            <p className="text-gray-600">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Food = () => {
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    item: MenuItem | null;
  }>({
    show: false,
    item: null,
  });
  const { facilityId, hostelId } = useParams();

  // Use the query hooks
  const { data: menuItems = [], isLoading, error } = useMenuItems();
  const deleteMenuItemMutation = useDeleteMenuItem();

  if (error) {
    toast.error("Failed to load menu items");
  }

  const handleDeleteMenuItem = async () => {
    if (!deleteConfirmation.item?._id) return;

    try {
      await deleteMenuItemMutation.mutateAsync(
        deleteConfirmation.item._id as string
      );
      toast.success("Menu item deleted successfully");
      setDeleteConfirmation({ show: false, item: null });
      setSelectedMenuItem(null);
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <UtensilsCrossed size={24} className="text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Food Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your hostel's weekly menu and food items
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock size={18} />
                <span>Last updated: Today, 2:30 PM</span>
              </div> */}
              <button
                onClick={() => setIsAddingMenuItem(true)}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white text-sm font-medium 
                rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-sm hover:shadow"
              >
                <Plus size={18} className="mr-2" />
                New Menu Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Weekly Menu Planner
                </h2>
              </div>
              <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                View Full Schedule
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {facilityId && hostelId && (
                <WeeklyMenu facilityId={facilityId} hostelId={hostelId} />
              )}
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Search Header */}
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Menu Items
                  </h2>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-sm rounded-lg font-medium">
                    {filteredItems.length} items
                  </span>
                </div>

                {/* Search Controls */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                      focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm
                    focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </div>

              {/* Menu Items List */}
              <div className="divide-y divide-gray-100 max-h-[calc(100vh-400px)] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedMenuItem(item)}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover ring-1 ring-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                              font-medium bg-amber-50 text-amber-700"
                            >
                              {item.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                      <UtensilsCrossed size={20} className="text-amber-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      No items found
                    </h3>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {isAddingMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
            <MenuItemForm
              onClose={() => setIsAddingMenuItem(false)}
              onSuccess={() => {
                setIsAddingMenuItem(false);
                toast.success("Menu item added successfully");
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <Modal
          isOpen={deleteConfirmation.show}
          onClose={() => setDeleteConfirmation({ show: false, item: null })}
          title="Delete Menu Item"
        >
          <div className="p-4 z-50">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirmation.item?.name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() =>
                  setDeleteConfirmation({ show: false, item: null })
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMenuItem}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Menu Item Details Modal */}
      {selectedMenuItem && (
        <MenuItemDetailsModal
          item={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          onDelete={() => {
            setDeleteConfirmation({ show: true, item: selectedMenuItem });
          }}
        />
      )}
    </div>
  );
};
