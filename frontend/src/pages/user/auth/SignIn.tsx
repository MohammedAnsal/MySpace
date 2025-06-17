import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signIn_image from "@/assets/user/SignIn.png";
import { 
  signInSchema,
  type SignInFormData,
} from "@/utils/validation/user.z.validation";
import { useEffect, useState } from "react";
import { signInRequest } from "@/services/Api/userApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { loginSuccess } from "@/redux/slice/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useGoogle } from "@/hooks/user/useGoogle";
import socketService from "@/services/socket/socket.service";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const { handleGoogleSuccess, handleGoogleError } = useGoogle();

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
    try {
      const response = await signInRequest(data);
      console.log(response.data)
      if (response.data.success) {
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("access-token", response.data.token);
        toast.success(response.data.message);

        dispatch(
          loginSuccess({
            userId: response.data.userId,
            email: response.data.email,
            fullName: response.data.username,
            role: response.data.role,
            token: response.data.token,
          })
        );

        // Connect to socket after successful login
        socketService.connect();
        // Emit user status as online
        socketService.emitUserStatus(response.data.userId, response.data.role, true);

        navigate("/home");
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("SignIn error:", error);
    } finally {
      setLoading(false);
    }
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
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  placeholder="Enter password*"
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link
                to="/auth/forgot-password"
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
}
