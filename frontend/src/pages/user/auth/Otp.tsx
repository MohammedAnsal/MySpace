// import { useState, useRef, useEffect } from "react";
// import OtpImage from "../../../assets/user/Otp.png";
// import type React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { resend_Otp, verify_Otp } from "../../../services/Api/userApi";
// import { toast } from "sonner";

// export default function OTPVerification() {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const email = location.state || { email: "" };

//   const startTimer = () => {
//     const newExpirationTime = Date.now() + 2 * 60 * 1000;
//     localStorage.setItem("otpExpiration", newExpirationTime.toString());
//     setTimeLeft(120);
//   };

//   // useEffect(() => {
//   //   inputRefs.current = inputRefs.current.slice(0, 4);
//   // }, []);

//   useEffect(() => {
//     const expirationTime = localStorage.getItem("otpExpiration");
//     const currentTime = Date.now();

//     if (!expirationTime || parseInt(expirationTime) <= currentTime) {
//       localStorage.removeItem("otpExpiration");
//       setTimeLeft(0);
//     } else {
//       const remaining = Math.max(
//         0,
//         Math.floor((parseInt(expirationTime) - currentTime) / 1000)
//       );
//       setTimeLeft(remaining);
//     }

//     const interval = setInterval(() => {
//       const expiration = parseInt(localStorage.getItem("otpExpiration") || "0");
//       const remaining = Math.max(
//         0,
//         Math.floor((expiration - Date.now()) / 1000)
//       );

//       setTimeLeft(remaining);

//       if (remaining === 0) {
//         localStorage.removeItem("otpExpiration");
//         clearInterval(interval);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleChange = (index: number, value: string) => {
//     if (value.length > 1) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value !== "" && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleSumbit = async () => {
//     try {
//       const otpValue = otp.join("");
//       const userEmail = email?.email || "";

//       const response = await verify_Otp(userEmail, otpValue);

//       if (response.data.success) {
//         toast.success(response.data.message);
//         navigate("/auth/signIn");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       toast.error("Failed to verify OTP. Please try again.");
//     }
//   };

//   const handleKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === "Backspace" && otp[index] === "" && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePrevious = () => {
//     navigate(-1);
//   };

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
//   };

//   const handleResendOTP = async () => {
//     try {
//       const response = await resend_Otp(email);
//       if (response.data.success) {
//         startTimer(); // Restart the timer
//         setOtp(["", "", "", ""]);
//         toast.success(response.data.message);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Resend OTP error:", error);
//       toast.error("Failed to resend OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#E2E1DF] p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
//         {/* Left Side */}
//         <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 relative">
//           {/* Previous Button */}
//           <button
//             onClick={handlePrevious}
//             className="absolute top-0 left-0 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
//               />
//             </svg>
//           </button>

//           <h1 className="text-2xl font-semibold">MySpace</h1>
//           <img
//             src={OtpImage || "/placeholder.svg"}
//             alt="OTP Illustration"
//             className="mt-6 max-w-full h-auto"
//           />
//         </div>

//         {/* Right Side */}
//         <div className="w-full md:w-1/2 flex flex-col justify-center p-6">
//           <h2 className="text-2xl font-semibold text-center">Verify OTP</h2>
//           <p className="text-gray-600 text-center mt-2">
//             Enter the OTP sent to your Email or Phone
//           </p>

//           <div className="flex justify-center gap-3 mt-6">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 type="text"
//                 maxLength={1}
//                 className="w-12 h-12 border border-gray-300 text-center text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//               />
//             ))}
//           </div>

//           <p className="text-center text-gray-500 mt-4">
//             Time remaining:{" "}
//             <span
//               className={`${timeLeft < 30 ? "text-red-500" : "text-gray-700"}`}
//             >
//               {formatTime(timeLeft)}
//             </span>
//           </p>

//            {/* {timeLeft === 0 && (
//             <button
//               onClick={handleResendOTP}
//               className="mt-2 text-[#b08a63] hover:text-[#96745c] text-sm font-medium"
//             >
//               Resend OTP
//             </button>
//           )}  */}

//           <button
//             onClick={handleSumbit}
//             className="mt-6 w-full py-3 bg-[#b08a63] text-white rounded-lg font-semibold disabled:opacity-50"
//             disabled={timeLeft === 0}
//           >
//             Verify OTP
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import OtpImage from "../../../assets/user/Otp.png";
import type React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resend_Otp, verify_Otp } from "../../../services/Api/userApi";
import { toast } from "sonner";

const OTP_EXPIRATION_TIME = 90; // 1.5 minutes in seconds

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRATION_TIME);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const flag = location.state?.provider || "";
  const forgot = location.state?.forgott || "";

  useEffect(() => {
    // Check if there's an existing expiration time in localStorage
    const storedExpirationTime = localStorage.getItem("otpExpiration");
    const currentTime = Date.now();

    if (storedExpirationTime) {
      const remainingTime = Math.max(
        0,
        Math.floor((Number.parseInt(storedExpirationTime) - currentTime) / 1000)
      );
      setTimeLeft(remainingTime);
    } else {
      // If no stored expiration time, set a new one
      const newExpirationTime = currentTime + OTP_EXPIRATION_TIME * 1000;
      localStorage.setItem("otpExpiration", newExpirationTime.toString());
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          localStorage.removeItem("otpExpiration");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const otpValue = otp.join("");
      const userEmail = email || "";

      const response = await verify_Otp(userEmail, otpValue);

      if (response.data.success) {
        toast.success(response.data.message);
        if (flag == 1) {
          navigate("/provider/signIn");
        } else if (forgot == 1) {
          navigate("/auth/reset-password", {
            state: { emaill: userEmail },
          });
        } else {
          navigate("/auth/signIn");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleResendOTP = async () => {
    try {
      const response = await resend_Otp(email);
      console.log(response);
      if (response.data.success) {
        window.location.reload();
        const newExpirationTime = Date.now() + OTP_EXPIRATION_TIME * 1000;
        localStorage.setItem("otpExpiration", newExpirationTime.toString());
        setTimeLeft(OTP_EXPIRATION_TIME);
        setOtp(["", "", "", ""]);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E2E1DF] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 relative">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="absolute top-0 left-0 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h1 className="text-2xl font-semibold">MySpace</h1>
          <img
            src={OtpImage || "/placeholder.svg"}
            alt="OTP Illustration"
            className="mt-6 max-w-full h-auto"
          />
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6">
          <h2 className="text-2xl font-semibold text-center">Verify OTP</h2>
          <p className="text-gray-600 text-center mt-2">
            Enter the OTP sent to your Email or Phone
          </p>

          <div className="flex justify-center gap-3 mt-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="w-12 h-12 border border-gray-300 text-center text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <p className="text-center text-gray-500 mt-4">
            Time remaining:{" "}
            <span
              className={`${timeLeft < 30 ? "text-red-500" : "text-gray-700"}`}
            >
              {formatTime(timeLeft)}
            </span>
          </p>

          {timeLeft === 0 && (
            <button
              onClick={handleResendOTP}
              className="mt-2 text-[#b08a63] hover:text-[#96745c] text-sm font-medium"
            >
              Resend OTP
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="mt-6 w-full py-3 bg-[#b08a63] text-white rounded-lg font-semibold disabled:opacity-50"
            disabled={otp.some((digit) => digit === "") || timeLeft === 0}
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}
