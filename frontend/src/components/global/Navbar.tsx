import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between bg-[#E6E6E6] px-6">
      {/* Menu Button */}
      <button className="rounded-full bg-[#F2F2F2] px-4 py-2 text-black">
        Menu
      </button>

      {/* Center Title */}
      <div className="text-base font-medium text-black">MySpace</div>

      {/* Login Button */}
      <button className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/90">
        <Link to="/login">Login</Link>
      </button>
    </nav>
  );
}
