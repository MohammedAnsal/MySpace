import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Star, Bed} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Hostel {
  _id: string;
  hostel_name: string;
  photos: string[];
  gender: string;
  monthly_rent: number;
  location: {
    address: string;
  };
  provider_id: {
    fullName: string;
  };
  averageRating?: number;
  ratingCount?: number;
  available_space: number;
  total_space: number;
}

interface HostelCardProps {
  hostel: Hostel;
}

const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
  const navigate = useNavigate();
  const isNoBedsAvailable = hostel.available_space <= 0;

  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      onClick={() => navigate(`/accommodations/${hostel._id}`)}
      className="relative h-[300px] rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Background Image */}
      <motion.img
        src={hostel.photos[0]}
        alt={hostel.hostel_name}
        className="w-full h-full object-cover"
      />

      {/* Price Badge */}
      <div className="absolute top-3 left-3 z-20">
        <span className="bg-green-400 backdrop-blur-sm text-gray-900 px-2 py-1.5 rounded-full text-xs font-semibold">
          ${hostel.monthly_rent}/month
        </span>
      </div>

      {/* Rating Badge */}
      {(hostel.averageRating !== undefined && hostel.ratingCount) && (
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-amber-400 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-3.5 h-3.5 mr-1 fill-gray-900" />
            {hostel.averageRating.toFixed(1)}
          </span>
        </div>
      )}

      {/* Availability Badge */}
      <div className="absolute top-12 left-3 z-20">
        <span className={`backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center ${
          isNoBedsAvailable 
            ? 'bg-red-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          <Bed className="w-2 h-2 mr-1" />
          {isNoBedsAvailable ? 'Full' : `${hostel.available_space}/${hostel.total_space}`}
        </span>
      </div>

      <motion.div
        variants={{
          initial: { opacity: 1 },
          hover: { opacity: 0 },
        }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
      >
        <h3 className="text-xl font-semibold text-white line-clamp-1">
          {hostel.hostel_name}
        </h3>
      </motion.div>

      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
      >
        {/* Content Container */}
        <motion.div
          variants={{
            initial: { y: 20, opacity: 0 },
            hover: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
        >
          {/* Hostel Name and Gender */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold line-clamp-1">
              {hostel.hostel_name}
            </h3>
            <span className="bg-main-color backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-sm font-medium">
              {hostel.gender}
            </span>
          </div>

          {/* Rating Display (visible on hover) */}
          {(hostel.averageRating !== undefined && hostel.ratingCount) && (
            <div className="flex items-center space-x-2 text-amber-400 text-sm mb-2">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>
                {hostel.averageRating.toFixed(1)} ({hostel.ratingCount} {hostel.ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center space-x-2 text-white/90 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{hostel.location.address}</span>
          </div>

          {/* Provider */}
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <Users className="w-4 h-4" />
            <span className="line-clamp-1">
              By {hostel.provider_id.fullName}
            </span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        className="absolute inset-0 rounded-xl ring-1 ring-white/30 pointer-events-none"
      />
    </motion.div>
  );
};

export default HostelCard; 