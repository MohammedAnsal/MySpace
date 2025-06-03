import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { googleRequest } from "@/services/Api/providerApi";
import { loginSuccess } from "@/redux/slice/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import socketService from "@/services/socket/socket.service";

export const useProviderGoogle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: googleLogin } = useMutation({
    mutationFn: async (credential: string) => {
      return await googleRequest(credential);
    },

    onSuccess: (response) => {
      if (response.success) {
        localStorage.setItem("role", response.role);
        localStorage.setItem("access-token", response.token);
        dispatch(
          loginSuccess({
            userId: response.userId,
            fullName: response.fullName,
            email: response.email,
            role: response.role,
            token: response.token,
          })
        );
        // Connect to socket after successful login
        socketService.connect();
        // Emit user status as online
        socketService.emitUserStatus(response.userId, response.role, true);
        toast.success("Login successful!");
        navigate("/provider/dashboard");
      }
    },
    onError: (error: any) => {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    },
  });

  const handleGoogleSuccess = (credentialResponse: any) => {
    googleLogin(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
  };
};
