import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import login_img from "../../../assets/provider/signUp.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  signInSchema,
  SignInFormData,
} from "../../../utils/validation/provider.z.validation";
import { Link, useNavigate } from "react-router-dom";
import { signIn_Request } from "../../../services/Api/providerApi";
import { useDispatch } from "react-redux";
import { loginnSuccess } from "../../../redux/slice/providerSlice";

const ProviderLogin = () => {
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
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  }, [errors]);

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const response = await signIn_Request(data);
      if (response.data.success) {
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("access-token", response.data.accessToken);
        toast.success(response.data.message);
        dispatch(
          loginnSuccess({
            email: response.data.email,
            fullName: response.data.fullName,
            role: response.data.role,
            token: response.data.accessToken,
          })
        );
        navigate("/provider/dashboard");
      } else {
        toast.error(response.data.message);
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
          Welcome Back!
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Provider Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded mb-4 pr-10"
            />
            <span
              className="absolute top-4 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c3a07c] text-white p-3 rounded hover:bg-[#a38565] transition"
          >
            {loading ? (
              <>
                <span className="loader mr-2"></span>
                Login...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm md:text-base">
          Don't have an account?{" "}
          <Link
            to={"/provider/signUp"}
            className="font-bold cursor-pointer text-[#c3a07c] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Right Side (Image Section) */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={login_img}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProviderLogin;
