import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  hostelName: string;
  address: string;
}

const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  latitude,
  longitude,
  hostelName,
  address,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-20 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl bg-white rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 m-4 z-[400]">
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="h-[80vh]">
          <MapContainer
            center={[latitude, longitude]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-medium text-gray-900">{hostelName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{address}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MapModal; 