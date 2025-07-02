import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import signUp_img from "../../../assets/provider/signUp.jpg";
import {
  FormValues,
  signUpSchema,
} from "../../../utils/validation/provider.z.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signUpRequest } from "../../../services/Api/providerApi";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const ProviderSignup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Handle form validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error.message);
      });
    }
  }, [errors]);

  const onSubmit = async (data: FormValues) => {
    const flag = 1;
    setLoading(true);
    try {
      const response = await signUpRequest(data);

      if (response.data.success) {
        localStorage.removeItem("otpExpiration");
        toast.success(response.data.message);
        navigate("/auth/verify-otp", {
          state: { email: data.email, provider: flag },
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Signup error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to connect to the server. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side (Form Section) */}
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center p-6 md:p-10 min-h-screen md:min-h-0">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          Welcome to MySpace
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Provider SignUp</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-3"
        >
          <div>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            />
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            />
          </div>

          <div>
            <input
              {...register("phone")}
              type="text"
              placeholder="Phone Number"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            />
          </div>

          <div>
            <select
              {...register("gender")}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            />
            <span
              className="absolute top-4 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            />
            <span
              className="absolute top-4 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {!showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c3a07c] text-white p-3 rounded hover:bg-[#a38565] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm md:text-base">
          Already have an account?{" "}
          <Link
            to={"/provider/signIn"}
            className="font-bold cursor-pointer text-[#c3a07c] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* Right Side (Image Section) */}
      <div className="hidden md:block w-1/2 min-h-screen">
        <img
          src={signUp_img}
          alt="Sign Up"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProviderSignup;
