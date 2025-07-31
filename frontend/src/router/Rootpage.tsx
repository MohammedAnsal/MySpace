import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { ProtecteddRoute } from "./authRoutes/user/protectRoute";
import { Role } from "@/types/types";
import HomePage from "@/pages/user/home/Home";
import { Landing } from "@/components/global/landing";
import ProviderDashboard from "@/pages/provider/Home/Home";

const RootPage = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  return isAuthenticated ? (
    role == "user" ? (
      <ProtecteddRoute allowedRole={Role.USER}>
        <HomePage />
      </ProtecteddRoute>
    ) : (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <ProviderDashboard />
      </ProtecteddRoute>
    )
  ) : (
    <Landing />
  );
};

export default RootPage