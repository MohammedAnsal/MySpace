import { useState } from "react";
import forgotPass from "@/assets/user/forgott.png";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "@/services/Api/userApi";
import { toast } from "sonner";
import { AxiosError } from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.emaill || "";

  if (!email) {
    navigate("/auth/forgot-password");
    return null;
  }

  const handlePrevious = () => {
    navigate(-1);
  };

  const validatePasswords = () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSumbit = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const response = await resetPassword(email, newPassword);

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successful!");
        navigate("/auth/signIn");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Failed to reset password:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-h-screen items-center justify-center bg-[#E2E1DF] p-4">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-5xl">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 relative">
          <button
            onClick={handlePrevious}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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

          <h1 className="text-2xl font-semibold">MySpace</h1>

          <div className="mt-6">
            <img
              src={forgotPass || "/placeholder.svg"}
              alt="Reset Password"
              className="w-40 sm:w-56 md:w-64 h-auto"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6">
          <h2 className="text-2xl font-semibold text-center">
            Enter new password
          </h2>
          <p className="text-base text-gray-600 text-center mt-2">
            Your new password must be at least 8 characters long
          </p>

          <div className="mt-6">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password*
            </label>
            <input
              id="newPassword"
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            {newPassword && newPassword.length < 8 && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password*
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            onClick={handleSumbit}
            className="mt-6 w-full py-3 bg-[#b08a63] text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center"
            disabled={
              loading ||
              !newPassword ||
              !confirmPassword ||
              newPassword.length < 8 ||
              newPassword !== confirmPassword
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
              "Confirm"
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/auth/signIn")}
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

export default ResetPassword;
