import React, { useState } from 'react';
import { Upload, MapPin, Home, Bed, Bath, DollarSign } from 'lucide-react';

interface PropertyForm {
  title: string;
  description: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  amenities: string[];
}

const AddProperty: React.FC = () => {
  const [formData, setFormData] = useState<PropertyForm>({
    title: '',
    description: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: 'apartment',
    amenities: [],
  });

  const [images, setImages] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Images:', images);
  };

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Property</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                placeholder="Enter property title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                placeholder="Describe your property"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Location & Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                placeholder="Enter property address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per night
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">
                  <DollarSign size={20} />
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                  placeholder="No. of bedrooms"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
                  placeholder="No. of bathrooms"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Images</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="images"
            />
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={48} className="text-gray-400 mb-2" />
              <p className="text-gray-600">Click to upload images</p>
              <p className="text-sm text-gray-500">Maximum 10 images</p>
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-200 rounded-lg hover:bg-amber-300 transition-colors"
          >
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty; 