import React, { useState } from 'react';
import { Search, Filter, Star, Edit2, Trash2 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  status: 'active' | 'inactive';
}

const Properties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const properties: Property[] = [
    {
      id: '1',
      title: 'Modern Apartment in City Center',
      type: 'Apartment',
      address: '123 Main St, City',
      price: 150,
      rating: 4.8,
      reviews: 24,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      status: 'active',
    },
    {
      id: '2',
      title: 'Cozy Beach House',
      type: 'House',
      address: '456 Beach Rd, Coast',
      price: 200,
      rating: 4.5,
      reviews: 18,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      status: 'active',
    },
    {
      id: '3',
      title: 'Mountain View Villa',
      type: 'Villa',
      address: '789 Mountain Ave, Hills',
      price: 300,
      rating: 4.9,
      reviews: 32,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      status: 'inactive',
    },
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log('Delete property:', id);
  };

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log('Edit property:', id);
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <h1 className="text-2xl font-semibold">My Properties</h1>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-4 right-4 px-2 py-1 rounded text-sm ${
                  property.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {property.status}
              </span>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-medium mb-1">{property.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{property.address}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">${property.price}</span>
                <div className="flex items-center">
                  <Star className="text-yellow-400 w-5 h-5" fill="currentColor" />
                  <span className="ml-1 text-sm text-gray-600">
                    {property.rating} ({property.reviews})
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(property.id)}
                  className="p-2 text-gray-600 hover:text-amber-500 transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found</p>
        </div>
      )}
    </div>
  );
};

export default Properties; 