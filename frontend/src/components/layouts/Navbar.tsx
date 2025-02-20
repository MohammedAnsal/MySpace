import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-[#E2E1DF] px-6 pt-5">
      {/* Menu Button */}
      <button className="rounded-full bg-[#F2F2F2] px-4 py-2 text-black">
        <Link to="/">Menu</Link>
      </button>

      {/* Center Title */}
      <div className="text-xl pb-8 font-medium text-black">MySpace</div>

      {/* Login Button */}
      <button className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/90">
        <Link to="/auth/signIn">Login</Link>
      </button>
    </nav>
  );
}
