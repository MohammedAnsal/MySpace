import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Upload, X, Home } from "lucide-react";
import signUp_img from "../../../assets/provider/signUp.jpg";
import {
  FormValues,
  signUpSchema,
} from "../../../utils/validation/provider.z.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { signUpRequest } from "../../../services/Api/providerApi";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "@/style/phone-input.css";

const ProviderSignup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setValue("documentImage", file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setValue("documentImage", undefined as any);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const flag = 1;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("gender", data.gender);
      formData.append("documentType", data.documentType);
      if (data.documentImage) {
        formData.append("documentImage", data.documentImage);
      }

      const response = await signUpRequest(formData);

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
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 hover:text-[#c3a07c] group"
      >
        <Home
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="text-sm font-medium hidden sm:inline">Home</span>
      </Link>

      {/* Image Section - visible on mobile and desktop */}
      <div className="w-full md:w-1/2 h-56 md:h-auto">
        <img
          src={signUp_img}
          alt="Sign Up"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center px-4 py-8 md:p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-lg md:text-xl font-semibold mb-1 text-center">
            Welcome to MySpace
          </h2>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Provider SignUp
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-3">
              <input
                {...register("fullName")}
                type="text"
                placeholder="Full Name"
                className="w-full p-3 text-base border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
              />

              <select
                {...register("gender")}
                className="w-full p-3 text-base border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Email */}
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full p-3 text-base border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  international
                  defaultCountry="IN"
                  withCountryCallingCode
                  placeholder="Phone Number"
                  className="phone-input"
                />
              )}
            />

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 text-base border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>

              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-3 text-base border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {!showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </span>
              </div>
            </div>

            {/* Document Verification */}
            <div className="border-t pt-3 mt-3">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">
                Document Verification
              </h3>

              <select
                {...register("documentType")}
                className="w-full p-3 text-base border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
              >
                <option value="">Select Document Type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
              </select>

              <div className="border-2 border-dashed border-gray-300 rounded p-3">
                {!selectedFile ? (
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload document image
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="document-upload"
                    />

                    <label
                      htmlFor="document-upload"
                      className="inline-flex items-center px-3 py-1.5 text-sm rounded text-white bg-[#c3a07c] hover:bg-[#a38565] cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={previewUrl as string}
                      alt="Preview"
                      className="max-h-20 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c3a07c] text-white p-3 rounded hover:bg-[#a38565] transition disabled:opacity-50 flex justify-center text-base"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/provider/signIn"
              className="font-bold text-[#c3a07c] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderSignup;
