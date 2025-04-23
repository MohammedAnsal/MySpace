import { BrowserRouter } from "react-router-dom";
import Footer from "./components/layouts/Footer";
import Navbar from "./components/layouts/Navbar";
import AdminSignUp from "./pages/admin/Auth/SignIn";
import ProviderSignup from "./pages/provider/Auth/SignUp";
import OTPVerification from "./pages/user/Auth/Otp";
import SignIn from "./pages/user/Auth/SignIn";
import SignUp from "./pages/user/Auth/SignUp";
import HomePage from "./pages/user/Home/Home";
import AdminSignIn from "./pages/admin/Auth/SignIn";
import UserProfile from "./pages/user/Home/profile/UserProfile";
import { Landing } from "./components/global/Landing";

const App = () => {
  return (
    <div>
      <BrowserRouter>
              {/* <AdminSignUp /> */}
              {/* <UserProfile/> */}
        {/* <AdminSignIn /> */}
        <Landing/>
      </BrowserRouter>
      {/* <SignIn/> */}
      {/* <SignUp/> */}
      {/* <Navbar /> */}
      {/* <HomePage/> */}
      {/* <Footer/> */}
      {/* <OTPVerification/> */}
      {/* <ProviderSignup /> */}
    </div>
  );
};

export default App;
