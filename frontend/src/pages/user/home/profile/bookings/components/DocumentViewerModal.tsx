import React, { useState } from "react";
import { X, Download, Eye, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName?: string;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentName = "Uploaded Document",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);

      // Fetch the document
      const response = await fetch(documentUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = documentName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document. Please try again.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      rotateX: -10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] relative overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div
              className="bg-gradient-to-r from-[#b9a089]/10 to-[#b9a089]/20 px-6 py-4 border-b border-[#b9a089]/20 flex justify-between items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center">
                <FileText className="text-[#b9a089] mr-3" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">
                  {documentName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleDownload}
                  disabled={downloadLoading}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-[#b9a089] rounded-lg hover:bg-[#a58e77] transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {downloadLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={14} />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2" size={14} />
                      Download
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* Document Viewer */}
            <div className="relative h-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <div className="text-center">
                    <Loader2
                      className="animate-spin mx-auto mb-2 text-[#b9a089]"
                      size={32}
                    />
                    <p className="text-gray-600">Loading document...</p>
                  </div>
                </div>
              )}

              <iframe
                src={documentUrl}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                title="Document Viewer"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewerModal;
