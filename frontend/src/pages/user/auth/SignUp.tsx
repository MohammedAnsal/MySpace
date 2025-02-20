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
import { signUp_Request } from "../../../services/Api/userApi";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Show validation errors

  useEffect(() => {
    console.log(errors);
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, [errors]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const response = await signUp_Request(data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/auth/verify-otp", { state: { email: data.email } });
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#E2E1DF] relative ">
      {/* <div className="absolute top-6 right-6">
        <Link
          to="/signin"
          className="bg-[#C4A484] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#B39476] transition"
        >
          Login
        </Link>
      </div> */}

      <div className="md:w-1/2 flex flex-col items-center justify-center p-8 w-full">
        {/* <div className="absolute top-8 left-8">
          <h2 className="text-2xl font-bold text-gray-800">MySpace</h2>
        </div> */}
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
              {/* {errors.fullName && (
                <p className="text-red-500 text-xs">
                  {errors.fullName.message}
                </p>
              )} */}
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
              {/* {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )} */}
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Enter password*"
              />
              {/* {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )} */}
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
              {/* {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )} */}
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Confirm password*"
              />
              {/* {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )} */}
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
          <button
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 py-3 rounded-lg transition duration-200"
            type="button"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
