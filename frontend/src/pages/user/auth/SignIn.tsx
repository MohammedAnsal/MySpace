import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signIn_image from "../../../assets/user/SignIn.png";
import {
  signInSchema,
  type SignInFormData,
} from "../../../utils/validation/user.z.validation";
import { useEffect, useState } from "react";
import { signIn_Requset } from "../../../services/Api/userApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store/store";
import { loginSuccess } from "../../../redux/slice/userSlice";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Show validation errors

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, [errors]);

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    const response = await signIn_Requset(data);
    if (response.data.success) {
      localStorage.setItem("access-token", response.data.accessToken);
      toast.success(response.data.message);
      dispatch(
        loginSuccess({
          email: response.data.email,
          fullName: response.data.username,
          token: response.data.accessToken,
        })
      );
      navigate("/");
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(response.data.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#E2E1DF] relative">
      {/* Left Column - Image Area */}
      <div className="md:w-1/2 flex flex-col items-center justify-center relative p-8 w-full">
        <img
          src={signIn_image}
          alt="Illustration"
          className="w-[100%] max-w-xs md:max-w-md h-auto object-cover"
        />
      </div>

      {/* Center Vertical Divider */}
      <div className="hidden md:block absolute left-1/2 top-1/4 bottom-1/4 w-[1px] bg-black"></div>

      {/* Right Column - Login Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600">
              New here?{" "}
              <Link
                to="/auth/signUp"
                className="text-[#C4A484] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="Enter email id*"
                type="email"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
              />
              {/* {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )} */}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <input
                {...register("password")}
                placeholder="Enter password*"
                type="password"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none"
              />
              {/* {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )} */}
            </div>
            <div className="text-right">
              <Link
                to="/forgot"
                className="text-sm text-gray-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <button
              className="w-full bg-[#C4A484] hover:bg-[#B39476] text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loader mr-2"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="relative my-6">
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
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-semibold transition duration-200"
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
}
