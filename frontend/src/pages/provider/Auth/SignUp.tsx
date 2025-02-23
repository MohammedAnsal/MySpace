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
import { signUp_Request } from "../../../services/Api/providerApi";
import { Link, useNavigate } from "react-router-dom";

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
      const response = await signUp_Request(data);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/auth/verify-otp", {
          state: { email: data.email, provider: flag },
        });
      } else {
        toast.error(response.data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side (Form Section) */}
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          Welcome to MySpace
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Provider SignUp</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <input
            {...register("fullName")}
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded mb-2"
          />
          {/* {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )} */}

          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-2"
          />
          {/* {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )} */}

          <input
            {...register("phone")}
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 border rounded mb-2"
          />
          {/* {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )} */}

          <select
            {...register("gender")}
            className="w-full p-3 border rounded mb-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {/* {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )} */}

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded mb-2 pr-10"
            />
            <span
              className="absolute top-4 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {/* {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )} */}

          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded mb-2 pr-10"
            />
            <span
              className="absolute top-4 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {/* {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )} */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c3a07c] text-white p-3 rounded hover:bg-[#a38565] transition"
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
      <div className="hidden md:block w-1/2 h-full">
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
