import { useForm } from "react-hook-form";
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

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleGoogleSuccess, handleGoogleError } = useGoogle();

  const {
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
    } catch (error: any) {
      console.error("Signup error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#E2E1DF] relative ">
      <div className="md:w-1/2 flex flex-col items-center justify-center p-8 w-full">
        <img
          src={signUp_image}
          alt="Illustration"
          width={400}
          height={400}
          className="w-[100%] max-w-xs md:max-w-md h-auto object-cover"
        />
      </div>

      <div className="hidden md:block absolute left-1/2 top-1/4 bottom-1/4 w-[1px] bg-black"></div>

      <div className="md:w-1/2 w-full flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/signIn"
                className="text-[#C4A484] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">
                Full Name
              </label>
              <input
                {...register("fullName")}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Full Name*"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Enter email id*"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none pr-10"
                  placeholder="Enter password*"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Enter phone number*"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none pr-10"
                  placeholder="Confirm password*"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
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

            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">Gender</label>
              <select
                {...register("gender")}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">Select Gender*</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {/* {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender.message}</p>
              )} */}
            </div>

            <div className="col-span-2">
              <button
                className="w-full bg-[#C4A484] hover:bg-[#B39476] text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#E2E1DF] text-gray-500">
                Or sign in with
              </span>
            </div>
          </div>
          <div className="flex justify-center">
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
