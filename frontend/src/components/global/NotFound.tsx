import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E2E1DF] flex flex-col items-center justify-center pb-16">
        <div className="text-center">
          <h1 className="font-italiana text-7xl md:text-8xl mb-6">404</h1>
          <h2 className="font-italiana text-4xl mb-4">Page Not Found</h2>
          <p className="font-dm_sans text-lg mb-8">
            "Oops! It seems you've wandered into uncharted territory. <br />
            Let's guide you back to your perfect stay."
          </p>
          <Link
            to="/"
            className="font-dm_sans bg-[#B58C5F] text-white px-6 py-3 rounded-lg hover:bg-[#9A7B4F] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
