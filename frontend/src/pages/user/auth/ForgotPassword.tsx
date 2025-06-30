import { useState } from "react";
import forgotPass from "@/assets/user/forgott.png";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/Api/userApi";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const forgot = 1;

  const handlePrevious = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response && response.data && response.data.message) {
        localStorage.removeItem("otpExpiration");
        toast.success(response.data.message);
        navigate("/auth/verify-otp", {
          state: { email: email, forgott: forgot },
        });
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-h-screen mt-10 items-center justify-center bg-[#E2E1DF] p-4 py-10">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 relative">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="absolute top-0 left-0 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h1 className="text-xl sm:text-2xl font-semibold">MySpace</h1>

          {/* Forgot Password Illustration */}
          <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <img
                src={forgotPass}
                alt="Forgot Password"
                className="w-32 sm:w-40 md:w-48 h-auto"
              />
            </div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 text-center">
              Don't worry, we'll help you reset your password.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-center">
            Forgot Password
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mt-2">
            Enter your email to receive a password reset link
          </p>

          <div className="mt-4 sm:mt-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address*
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 sm:mt-6 w-full py-2 sm:py-3 bg-[#b08a63] text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center"
            disabled={
              loading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            }
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="mt-3 sm:mt-4 text-center">
            <button
              onClick={handlePrevious}
              className="text-[#b08a63] hover:text-[#96745c] text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
