// import main_pic from "../../../assets/user/main.jpg";
import main_pic_1 from "../../../assets/user/main1.jpg";
import main_pic_2 from "../../../assets/user/main2.jpg";
// import main_pic_3 from "../../../assets/user/main3.jpg";
import m1 from "../../../assets/user/m1.jpg";
import m2 from "../../../assets/user/m2.jpg";
import Footer from "../../../components/layouts/Footer";
import Navbar from "../../../components/layouts/Navbar";
import StaySelector from "../../../components/ui/StaySelector";

export default function HomePage() {

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E2E1DF]  pb-16">
        {/* Hero Section */}
        <section className="relative mb-16 pt-16">
          <div className="relative mx-auto aspect-[18/9] max-w-7xl overflow-hidden rounded-lg">
            <img
              src={m1}
              alt="Minimalist bedroom with wooden furniture"
              className="object-cover w-full h-full"
              loading="lazy"
            />
            {/* Overlay Text */}
            <h1 className="font-italiana absolute inset-0 flex items-center justify-center text-white text-7xl md:text-8xl bg-black/10">
              dream stay
            </h1>
          </div>
        </section>

        {/* Room Options Section */}
        <section className="mb-12 pt-4">
          <h2 className="font-italiana text-center text-4xl font-light mb-6">
            Decide Your Stay
          </h2>
          <StaySelector />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto cursor-pointer">
            {[
              { src: main_pic_1, title: "Comfy Haven" },
              { src: main_pic_2, title: "Heavenly Stay" },
              { src: m2, title: "The Cozy Corner" },
            ].map((room, index) => (
              <div key={index} className="relative flex flex-col items-center">
                {/* Background behind the image but only visible at the bottom */}
                <div className="bg-gray-100 rounded-2xl w-60 h-80 absolute"></div>

                {/* Image placed on top of the background */}
                <div className="relative w-60 h-72 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={room.src}
                    alt={room.title}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>

                {/* Title positioned inside the visible part of the background */}
                <div className="relative text-gray-900 text-sm font-medium mt-2">
                  {room.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Boxes Section */}
        <div className="pt-9">
          {/* Full-width black background */}
          <div className="py-12 bg-black">
            <section className="grid gap-6 max-w-6xl mx-auto">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Text Box with Arrow */}
                <div className="relative font-dm_sans bg-[#B58C5F] rounded-2xl p-6 text-white shadow-md flex flex-col justify-between w-full">
                  <p className="text-[18px] leading-[1.7]">
                    "Your perfect stay awaits— <br />
                    where comfort meets care. <br />
                    <span>For boys, for girls, for everyone.</span>
                    A place where warmth embraces you, where every corner speaks
                    of home. <br />
                    Discover a haven designed with love, crafted for your peace
                    and ease."
                  </p>

                  <div className="absolute top-4 right-4 bg-white text-[#B58C5F] rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-xl font-bold">
                    ➜
                  </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { src: main_pic_1, title: "Comfy Haven" },
                    { src: main_pic_2, title: "She Home" },
                  ].map((room, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col items-center"
                    >
                      {/* Background Shape Behind Image */}
                      <div className="absolute top-2 w-[95%] h-[225px] bg-gray-100 rounded-2xl"></div>

                      {/* Image */}
                      <div className="relative w-[95%] h-[200px] rounded-2xl overflow-hidden shadow-md z-10">
                        <img
                          src={room.src}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Room Name */}
                      <p className="text-black text-center text-sm mt-1 font- z-0">
                        {room.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centered Info Box */}
              <div className="font-dm_sans bg-[#B58C5F] rounded-2xl py-5 text-white shadow-md items-center flex flex-col">
                <p className="text-[18px] leading-[2]">
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
