import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";
import L from "leaflet";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  onSelectLocation: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  onClose?: () => void;
}

interface LocationData {
  position: [number, number];
  address: string;
}

const MapPicker: React.FC<MapPickerProps> = ({ onSelectLocation, onClose }) => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
        {
          headers: {
            "Accept-Language": "en", // Request English language results
          },
        }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const addressParts = [];
      if (data.address) {
        const addr = data.address;
        if (addr.house_number) addressParts.push(addr.house_number);
        if (addr.road) addressParts.push(addr.road);
        if (addr.suburb) addressParts.push(addr.suburb);
        if (addr.city || addr.town) addressParts.push(addr.city || addr.town);
        if (addr.state) addressParts.push(addr.state);
        if (addr.country) addressParts.push(addr.country);
      }

      return addressParts.length > 0
        ? addressParts.join(", ")
        : data.display_name;
    } catch (err) {
      console.error("Error fetching address:", err);
      throw new Error("Failed to get address for selected location");
    }
  };

  const LocationMarker: React.FC = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setIsLoading(true);
        setError(null);

        try {
          const address = await getAddressFromCoordinates(lat, lng);
          setLocationData({
            position: [lat, lng],
            address,
          });
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      },
    });

    return locationData ? <Marker position={locationData.position} /> : null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">Select Hostel Location</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <MapContainer
            center={[10.8505, 76.2711]}
            zoom={10}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>

          {isLoading && (
            <div className="mt-2 text-amber-600">Fetching address...</div>
          )}

          {error && <div className="mt-2 text-red-600">{error}</div>}

          {locationData && !isLoading && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Selected Location:</span>{" "}
                {locationData.address}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Coordinates: {locationData.position[0].toFixed(6)},{" "}
                {locationData.position[1].toFixed(6)}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (locationData) {
                  onSelectLocation({
                    lat: locationData.position[0],
                    lng: locationData.position[1],
                    address: locationData.address,
                  });
                }
              }}
              className="px-4 py-2 bg-amber-400 text-gray-800 rounded-lg hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-500"
              disabled={!locationData || isLoading}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
