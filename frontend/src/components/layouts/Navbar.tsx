import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { logout } from "@/redux/slice/userSlice";
import { user_Logout } from "@/services/Api/userApi";
import { toast } from "sonner";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await user_Logout();
    if (response.data) {
      toast.success(response.data.message);
      localStorage.removeItem("access-token");
      dispatch(logout());
    }
  };

  return (
    <nav className="flex items-center justify-between bg-[#E2E1DF] px-6 pt-5">
      <button className="rounded-full bg-[#F2F2F2] px-4 py-2 text-black">
        <Link to="/">Menu</Link>
      </button>

      <div className="text-xl pb-8 font-medium text-black">MySpace</div>

      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="rounded-full bg-black px-4 py-2 text-white"
        >
          Logout
        </button>
      ) : (
        <button className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/90">
          <Link to="/auth/signIn">Login</Link>
        </button>
      )}
    </nav>
  );
}
