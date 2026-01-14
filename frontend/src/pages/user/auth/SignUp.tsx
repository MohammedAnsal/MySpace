import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signUp_image from "../../../assets/user/SignUp.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FormValues,
  signUpSchema,
} from "../../../utils/validation/user.z.validation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { signUpRequest } from "../../../services/Api/userApi";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogle } from "@/hooks/user/useGoogle";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "@/style/phone-input.css";
import { AxiosError } from "axios";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleGoogleSuccess, handleGoogleError } = useGoogle();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Show validation errors

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, [errors]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await signUpRequest(data);
      if (response.data.success) {
        localStorage.removeItem("otpExpiration");
        toast.success(response.data.message);
        navigate("/auth/verify-otp", { state: { email: data.email } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Signup error:", err.message);
      toast.error(
        err.response?.data?.message || err.message || "Sign up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#E2E1DF] ">
      {/* Image Section - Optimized for mobile */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8">
        <img
          src={signUp_image}
          alt="Illustration"
          className="w-full max-w-[280px] md:max-w-md h-auto object-contain"
        />
      </div>

      {/* Divider - Hidden on mobile */}
      <div className="hidden md:block absolute left-1/2 top-1/4 bottom-1/4 w-[1px] bg-black"></div>

      {/* Form Section - Improved mobile spacing */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-6 md:py-10">
        <div className="w-full max-w-md space-y-4 md:space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/signIn"
                className="text-[#C4A484] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Full Name */}
            <div className="space-y-1.5 md:space-y-1">
              <label className="block text-sm sm:text-base text-gray-700 font-medium">
                Full Name
              </label>
              <input
                {...register("fullName")}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent transition-all"
                placeholder="Full Name*"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5 md:space-y-1">
              <label className="block text-sm sm:text-base text-gray-700 font-medium">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent transition-all"
                placeholder="Enter email id*"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 md:space-y-1 relative">
              <label className="block text-sm sm:text-base text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent pr-10 transition-all"
                  placeholder="Enter password*"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5 md:space-y-1 md:col-span-1">
              <label className="block text-sm sm:text-base text-gray-700 font-medium">
                Phone Number
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry="IN"
                    withCountryCallingCode
                    placeholder="Enter phone number*"
                    className="w-full !flex items-center !p-2.5 sm:!p-3 !bg-white !border !border-gray-300 !rounded-lg focus-within:!ring-2 focus-within:!ring-[#C4A484] focus-within:!border-transparent transition-all [&_.PhoneInputInput]:!text-sm sm:[&_.PhoneInputInput]:!text-base [&_.PhoneInputInput]:!bg-transparent [&_.PhoneInputInput]:!border-none [&_.PhoneInputInput]:!outline-none [&_.PhoneInputInput]:!w-full"
                  />
                )}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 md:space-y-1 relative">
              <label className="block text-sm sm:text-base text-gray-700 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent pr-10 transition-all"
                  placeholder="Confirm password*"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {!showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1.5 md:space-y-1 md:col-span-1">
              <label className="block text-sm sm:text-base text-gray-700 font-medium">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Gender*</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <button
                className="w-full bg-[#C4A484] hover:bg-[#B39476] text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loader mr-2"></span>
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 bg-[#E2E1DF] text-gray-500">
                Or sign in with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center pb-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              text="signup_with"
              theme="filled_black"
              width={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
