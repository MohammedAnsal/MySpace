import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Admin_SignIn from "../../../assets/admin/AdminSignUp.png";
import {
  SignInFormData,
  signInSchema,
} from "../../../utils/validation/admin.z.validation";
import { signIn_Request } from "../../../services/Api/admin/adminApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/slice/adminSlice";
import { Link } from "react-router-dom";

const AdminSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    Object.values(errors).forEach((error: any) => {
      toast.error(error.message);
    });
  }, [errors]);

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const response = await signIn_Request(data);

      if (response.data.success) {
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("admin-access-token", response.data.token);
        toast.success(response.data.message || "Signed in successfully!");
        dispatch(
          loginSuccess({
            email: response.data.email,
            role: response.data.role,
            token: response.data.token,
          })
        );
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("SignIn error:", error);
      const errorMessage = error.response.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-[#242529] relative">
      {/* Left Column - Image Area */}
      <div className="md:w-1/2 flex flex-col items-center justify-center relative p-8 w-full">
        <img
          src={Admin_SignIn}
          alt="Sign Up Illustration"
          className="w-[100%] max-w-xs md:max-w-md h-auto object-cover"
        />
      </div>

      {/* Center Vertical Divider */}
      <div className="hidden md:block absolute left-1/2 top-1/4 bottom-1/4 w-[1px] bg-[#8D8D8D]"></div>

      {/* Right Column - Sign In Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 bg-[#D9D9D9] focus:ring-2 focus:ring-[#C8ED4F] text-black border border-gray-300 rounded-lg focus:outline-none"
                {...register("email")}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  className="w-full p-3 bg-[#D9D9D9] focus:ring-2 focus:ring-[#C8ED4F] border border-gray-300 rounded-lg focus:outline-none pr-10"
                  {...register("password")}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              className="w-full bg-[#C8ED4F] hover:bg-[#D4F562] text-gray-900 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              to="/admin/forgot-password"
              className="text-[#C8ED4F] hover:underline text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
