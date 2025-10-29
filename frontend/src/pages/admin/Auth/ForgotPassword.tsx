  import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Admin_ForgotPassword from "../../../assets/admin/AdminSignIn.png";
import { forgotPssword, resetPassword } from "@/services/Api/admin/adminApi";
import { AxiosError } from "axios";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      const response = await forgotPssword(email);
      if (response && response.data && response.data.success) {
        toast.success("Email verified. Please set a new password.");
        setEmailSubmitted(true);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to verify email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword(email, newPassword);
      if (response && response.data && response.data.success) {
        toast.success("Password updated successfully!");
        navigate("/admin/signIn");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#242529]">
      {/* Left Side (Form Section) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 min-h-screen md:min-h-0">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">
          Forgot Password?
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Reset Your Password
        </h1>

        {!emailSubmitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailSubmit();
            }}
            className="w-full max-w-sm"
          >
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#C8ED4F] bg-[#D9D9D9] text-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8ED4F] hover:bg-[#D4F562] text-gray-900 p-3 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
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
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordSubmit();
            }}
            className="w-full max-w-sm"
          >
            <div className="mb-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#C8ED4F] bg-[#D9D9D9] text-black"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#C8ED4F] bg-[#D9D9D9] text-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8ED4F] hover:bg-[#D4F562] text-gray-900 p-3 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
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
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm md:text-base text-white">
          Remember your password?{" "}
          <Link
            to="/admin/signIn"
            className="font-bold cursor-pointer text-[#C8ED4F] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* Right Side (Image Section) */}
      <div className="hidden md:block w-1/2 min-h-screen">
        <img
          src={Admin_ForgotPassword}
          alt="Forgot Password"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword