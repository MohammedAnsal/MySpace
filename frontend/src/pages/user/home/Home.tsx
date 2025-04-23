import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHostelsHome } from "@/hooks/user/useUserQueries";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import RoomOptionsSection from "./components/RoomOptionsSection";
import FeaturedStaysSection from "./components/FeaturedStaysSection";
import CTASection from "./components/CTASection";

export default function HomePage() {
  const { data } = useHostelsHome();
  console.log(data)
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const navigate = useNavigate();

  const filteredHostels = data?.data?.filter((hostel: { gender: string; }) => {
    if (selectedGender === "all") return true;
    return hostel.gender === selectedGender;
  }).slice(0, 3);

  const handleHostelClick = (hostelId: string) => {
    navigate(`/accommodations/${hostelId}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E2E1DF]">
        <HeroSection />
        <FeaturesSection />
        <RoomOptionsSection 
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          filteredHostels={filteredHostels}
        />
        <FeaturedStaysSection 
          filteredHostels={filteredHostels}
          handleHostelClick={handleHostelClick}
        />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
