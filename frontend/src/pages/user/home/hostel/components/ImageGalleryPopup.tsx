import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  hostel: any;
  selectedImage: string | null;
}

const ImageGalleryPopup: React.FC<ImageGalleryPopupProps> = ({
  isOpen,
  onClose,
  hostel,
  selectedImage,
}) => {
  const [currentImage, setCurrentImage] = useState(selectedImage);

  if (!isOpen) return null;

  const handlePrevious = () => {
    const currentIndex = hostel.photos.indexOf(currentImage);
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : hostel.photos.length - 1;
    setCurrentImage(hostel.photos[newIndex]);
  };

  const handleNext = () => {
    const currentIndex = hostel.photos.indexOf(currentImage);
    const newIndex =
      currentIndex < hostel.photos.length - 1 ? currentIndex + 1 : 0;
    setCurrentImage(hostel.photos[newIndex]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-7xl w-full mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 m-4 z-10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative h-[80vh] flex items-center justify-center">
          <motion.img
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={currentImage || ""}
            alt={hostel?.hostel_name}
            className="max-h-full max-w-full object-contain rounded-lg"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2 px-4">
          {hostel?.photos.map((photo: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                ${
                  photo === currentImage
                    ? "border-amber-500 scale-110"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImage(photo);
              }}
            >
              <img
                src={photo}
                alt={`${hostel?.hostel_name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageGalleryPopup; 