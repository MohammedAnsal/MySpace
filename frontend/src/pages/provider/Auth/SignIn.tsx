import { useState, useEffect } from "react";
import { Eye, EyeOff, Home } from "lucide-react";
import login_img from "../../../assets/provider/signUp.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  signInSchema,
  SignInFormData,
} from "../../../utils/validation/provider.z.validation";
import { Link, useNavigate } from "react-router-dom";
import { signInRequest } from "../../../services/Api/providerApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/slice/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { useProviderGoogle } from "@/hooks/provider/useProviderGoogle";
import socketService from "@/services/socket/socket.service";
import { AxiosError } from "axios";

const ProviderLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleGoogleSuccess, handleGoogleError } = useProviderGoogle();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, [errors]);

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const response = await signInRequest(data);

      if (response.data.success) {
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("access-token", response.data.token);
        toast.success(response.data.message);
        dispatch(
          loginSuccess({
            userId: response.data.userId,
            email: response.data.email,
            fullName: response.data.fullName,
            role: response.data.role,
            token: response.data.token,
          })
        );

        // Connect to socket after successful login
        socketService.connect();
        // Emit user status as online
        socketService.emitUserStatus(
          response.data.userId,
          response.data.role,
          true
        );

        navigate("/provider/dashboard");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to connect to the server. Please try again later.";
      toast.error(errorMessage);
      console.error("Login error:", err);
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
        <Home size={18} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">Home</span>
      </Link>

      {/* Left Side (Image Section) */}
      <div className="w-full md:w-1/2 h-56 md:h-auto">
        <img
          src={login_img}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Left Side (Form Section) */}
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center p-6 md:p-10 min-h-screen md:min-h-0">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          Welcome Back!
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Provider Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <div className="mb-4">
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#c3a07c]"
            />
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
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
                Signing in...
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

        <p className="mt-4 text-sm md:text-base">
          Don't have an account?{" "}
          <Link
            to={"/provider/signUp"}
            className="font-bold cursor-pointer text-[#c3a07c] hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <Link
          to="/provider/forgot-password"
          className="mt-2 text-sm text-[#c3a07c] hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Right Side (Image Section) */}
      {/* <div className="hidden md:block w-1/2 min-h-screen">
        <img
          src={login_img}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
};

export default ProviderLogin;
