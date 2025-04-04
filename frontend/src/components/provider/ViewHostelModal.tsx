import React from "react";
import Modal from "@/components/global/Modal";
import { MapPin, Users, Bed, Wifi, Car, Home } from "lucide-react";

interface ViewHostelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostel: any;
}

const ViewHostelModal: React.FC<ViewHostelModalProps> = ({
  isOpen,
  onClose,
  hostel,
}) => {
  if (!hostel) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hostel Details">
      <div className="space-y-6">
        {/* Image Gallery */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-2">
            {hostel.photos.slice(0, 4).map((photo: string, index: number) => (
              <div
                key={index}
                className={`relative ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={photo}
                  alt={`Hostel view ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {hostel.hostel_name}
          </h3>
          <p className="text-gray-600 mb-4">{hostel.description}</p>
        </div>

        {/* Location & Capacity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-amber-500" />
              <span className="text-sm">{hostel.location.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 text-amber-500" />
              <span className="text-sm">For {hostel.gender}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bed className="w-4 h-4 mr-2 text-amber-500" />
              <span className="text-sm">
                {hostel.available_space} of {hostel.total_space} beds available
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-gray-600">
              <span className="font-medium">Monthly Rent:</span>{" "}
              ₹{hostel.monthly_rent}
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Deposit:</span>{" "}
              ₹{hostel.deposit_amount}
            </div>
            <div className="text-gray-600">
              <span className="font-medium">Deposit Terms:</span>{" "}
              {hostel.deposit_terms}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {hostel.amenities.map((amenity: string, index: number) => (
              <div
                key={index}
                className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg"
              >
                <Wifi className="w-4 h-4 mr-2 text-amber-500" />
                <span className="text-sm">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Available Facilities
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {hostel.facilities.map((facility: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm font-medium">{facility.name}</span>
                </div>
                <span className="text-sm text-gray-600">₹{facility.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">House Rules</h4>
          <p className="text-gray-600 whitespace-pre-line">{hostel.rules}</p>
        </div>

        {/* Status Information */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                hostel.is_verified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {hostel.is_verified ? "Verified" : "Pending Verification"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewHostelModal;
