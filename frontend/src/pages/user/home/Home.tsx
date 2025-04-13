// import main_pic from "../../../assets/user/main.jpg";
import main_pic_1 from "../../../assets/user/main1.jpg";
import main_pic_2 from "../../../assets/user/main2.jpg";
// import main_pic_3 from "../../../assets/user/main3.jpg";
import m1 from "../../../assets/user/m1.jpg";
import m2 from "../../../assets/user/m2.jpg";
import Footer from "../../../components/layouts/Footer";
import Navbar from "../../../components/layouts/Navbar";
import StaySelector from "../../../components/ui/StaySelector";
import { useHostelsHome } from "@/hooks/user/useUserQueries";
import { JSXElementConstructor, Key, ReactElement, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { data } = useHostelsHome();
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
      <main className="min-h-screen bg-[#E2E1DF]  pb-16">
        {/* Hero Section */}
        <section className="relative mb-10 md:mb-16 pt-8 md:pt-16 px-4">
          <div className="relative mx-auto aspect-[18/9] max-w-7xl overflow-hidden rounded-lg">
            <img
              src={m1}
              alt="Minimalist bedroom with wooden furniture"
              className="object-cover w-full h-full"
              loading="lazy"
            />
            {/* Overlay Text */}
            <h1 className="font-italiana absolute inset-0 flex items-center justify-center text-white text-4xl md:text-7xl lg:text-8xl bg-black/10">
              dream stay
            </h1>
          </div>
        </section>

        {/* Room Options Section */}
        <section className="mb-12 pt-4">
          <h2 className="font-italiana text-center text-4xl font-light mb-6">
            Decide Your Stay
          </h2>
          <StaySelector onGenderChange={setSelectedGender} />
          <div className="grid gap-6 max-w-4xl mx-auto px-4 cursor-pointer place-items-center">
            {filteredHostels?.length > 0 ? (
              <div className={`grid gap-6 w-full ${
                filteredHostels.length === 1 ? 'grid-cols-1 justify-items-center' : 
                filteredHostels.length === 2 ? 'sm:grid-cols-2 grid-cols-1 justify-items-center' : 
                'sm:grid-cols-2 md:grid-cols-3 grid-cols-1 justify-items-center'
              }`}>
                {filteredHostels.map((hostel: { _id: string; photos: any[]; hostel_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; }, index: Key | null | undefined) => (
                  <div 
                    key={index} 
                    className="relative flex flex-col items-center transition-transform hover:scale-105 w-full max-w-[280px]"
                    onClick={() => handleHostelClick(hostel._id)}
                  >
                    <div className="bg-gray-100 rounded-2xl w-full h-80 absolute"></div>
                    <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-md">
                      <img
                        src={hostel.photos?.[0] || m2}
                        alt={hostel.hostel_name?.toString()}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="relative text-gray-900 text-sm font-medium mt-2 text-center">
                      {hostel.hostel_name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No hostels found for this filter.</p>
              </div>
            )}
          </div>
        </section>

        {/* Info Boxes Section */}
        <div className="pt-6 md:pt-9 px-4">
          {/* Full-width black background */}
          <div className="py-8 md:py-12 bg-black rounded-lg">
            <section className="grid gap-4 md:gap-6 max-w-6xl mx-auto">
              <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                {/* Text Box with Arrow */}
                <div className="relative font-dm_sans bg-[#B58C5F] rounded-2xl p-4 md:p-6 text-white shadow-md flex flex-col justify-between w-full">
                  <p className="text-base md:text-[18px] leading-[1.5] md:leading-[1.7]">
                    "Your perfect stay awaits— <br />
                    where comfort meets care. <br />
                    <span>For boys, for girls, for everyone.</span>
                    A place where warmth embraces you, where every corner speaks
                    of home. <br />
                    Discover a haven designed with love, crafted for your peace
                    and ease."
                  </p>

                  <div className="absolute top-4 right-4 bg-white text-[#B58C5F] rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg text-lg md:text-xl font-bold">
                    ➜
                  </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {filteredHostels?.slice(0, 2).map((hostel: { _id: string; photos: any[]; hostel_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; }, index: Key | null | undefined) => (
                    <div 
                      key={index} 
                      className="relative flex flex-col items-center cursor-pointer"
                      onClick={() => handleHostelClick(hostel._id)}
                    >
                      {/* Background Shape Behind Image */}
                      <div className="absolute top-2 w-[95%] h-[180px] md:h-[225px] bg-gray-100 rounded-2xl"></div>

                      {/* Image */}
                      <div className="relative w-[95%] h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md z-10">
                        <img
                          src={hostel.photos?.[0] || m2}
                          alt={hostel.hostel_name?.toString()}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Room Name */}
                      <p className="text-black text-center text-xs md:text-sm mt-1 z-0">
                        {hostel.hostel_name}
                      </p>
                    </div>
                  ))}
                  {filteredHostels?.length === 0 && [
                    { src: main_pic_1, title: "Comfy Haven" },
                    { src: main_pic_2, title: "She Home" },
                  ].map((room, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                      <div className="absolute top-2 w-[95%] h-[180px] md:h-[225px] bg-gray-100 rounded-2xl"></div>
                      <div className="relative w-[95%] h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md z-10">
                        <img
                          src={room.src}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white text-center text-xs md:text-sm mt-1 z-0">
                        {room.title}
                      </p>
                    </div>
                  ))}
                  {filteredHostels?.length === 1 && (
                    <div className="relative flex flex-col items-center">
                      <div className="absolute top-2 w-[95%] h-[180px] md:h-[225px] bg-gray-100 rounded-2xl"></div>
                      <div className="relative w-[95%] h-[160px] md:h-[200px] rounded-2xl overflow-hidden shadow-md z-10">
                        <img
                          src={main_pic_2}
                          alt="She Home"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white text-center text-xs md:text-sm mt-1 z-0">
                        She Home
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Centered Info Box */}
              <div className="font-dm_sans bg-[#B58C5F] rounded-2xl py-4 md:py-5 px-4 text-white shadow-md items-center flex flex-col">
                <p className="text-base md:text-[18px] leading-[1.7] md:leading-[2]">
                  "Find your perfect place to stay— where comfort, convenience,
                  and community come together.
                  <br />
                  A space designed for you, where every moment feels like home,
                  and every stay becomes a cherished memory."
                  <br />
                  "Whether it's a boys' hostel, a girls' haven, or shared
                  living, we're here to help you create lasting memories in a
                  home away from home. <br />
                  Experience warmth, belonging, and a place that truly cares.
                  ❤️"
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
