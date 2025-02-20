import { Outlet } from "react-router-dom";
import NavBar from "../../../components/layouts/Navbar";

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#E2E1DF]">
      <div className="flex-shrink-0">
        <NavBar />
      </div>

      <div className="flex-grow overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
