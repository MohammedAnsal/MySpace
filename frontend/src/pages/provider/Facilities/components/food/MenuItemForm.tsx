import React, { useState } from "react";
import { X, Camera } from "lucide-react";
import { useCreateMenuItem } from "@/hooks/provider/facility/useFacility";
import { toast } from "sonner";

interface MenuItemFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const MenuItemForm = ({ onClose, onSuccess }: MenuItemFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createMenuItem = useCreateMenuItem();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //  Add Menu Item :-

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("description", formData.description);
    submitFormData.append("category", formData.category);
    submitFormData.append("menuImage", image,);

    try {
      await createMenuItem.mutateAsync(submitFormData);
      toast.success("Menu item created successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to create menu item");
      console.error("Error creating menu item:", error);
    }
  };

  //  Edit Menu Item :-

  const handleEdit = async () => {
    
    

  }

  return (
    <div className="divide-y divide-gray-200">
      {/* Modal Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Add Menu Item</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Item Image
          </label>
          <div
            className={`mt-1 flex justify-center px-4 py-3 border-2 border-dashed rounded-lg 
            transition-colors ${
              imagePreview
                ? "border-amber-500 bg-amber-50"
                : "border-gray-300 hover:border-amber-500"
            }`}
          >
            {imagePreview ? (
              // Image Preview
              <div className="relative w-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white 
                  hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              // Upload Interface
              <div className="text-center">
                <Camera size={24} className="mx-auto text-gray-400 mb-1" />
                <div className="flex text-xs text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500">
                    <span>Upload</span>
                    <input
                      type="file"
                      name="menuImage"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 
            focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 
            focus:ring-amber-500 focus:border-amber-500"
            rows={2}
            placeholder="Brief description"
            required
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 
            focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Select category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 
            rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMenuItem.isPending}
            className="px-3 py-1.5 text-sm text-white bg-amber-500 rounded-md hover:bg-amber-600 
            shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMenuItem.isPending ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
};
