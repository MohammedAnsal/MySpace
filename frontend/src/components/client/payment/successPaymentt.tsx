import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { checkPaymentStatus } from "@/services/Api/userApi";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "expired" | "success">(
    "loading"
  );

  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        const data = await checkPaymentStatus(sessionId);

        if (data.status === "expired") {
          setStatus("expired");
        } else {
          setStatus("success");
        }
      } catch (err) {
        setStatus("expired");
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        {status === "success" ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mb-6 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed.
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-500 mb-6 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Expired
            </h1>
            <p className="text-gray-600 mb-8">
              This booking has expired. Please rebook to try again.
            </p>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Return to Home
        </motion.button>
      </motion.div>
    </div>
  );
};
export default SuccessPayment;
