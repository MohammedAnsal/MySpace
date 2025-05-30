import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import m2 from "@/assets/user/m2.jpg";
import main_pic_1 from "@/assets/user/main1.jpg";
import StaySelector from "@/components/ui/StaySelector";

interface RoomOptionsSectionProps {
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  filteredHostels: any[];
}

const RoomOptionsSection = ({
  setSelectedGender,
  filteredHostels,
}: RoomOptionsSectionProps) => {
  const navigate = useNavigate();
  const handleHostelClick = (hostelId: string) => {
    navigate(`/accommodations/${hostelId}`);
  };

  return (
    <section className="py-16 bg-[#F8F8F8] px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-italiana text-4xl md:text-5xl text-center mb-10">
          Find Your Space
        </h2>

        <div className="mb-10">
          <StaySelector onGenderChange={setSelectedGender} />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {filteredHostels?.length > 0
            ? filteredHostels.slice(0, 2).map((hostel, index) => (
                <motion.div
                  key={index}
                  className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index ? 0.2 : 0 }}
                  viewport={{ once: true }}
                  onClick={() => handleHostelClick(hostel._id)}
                >
                  <img
                    src={hostel.photos?.[0] || m2}
                    alt={`${hostel.hostel_name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-2xl font-medium mb-2">
                        {hostel.hostel_name}
                      </h3>
                      <p className="text-white/80 mb-4">
                        {hostel.gender === "male"
                          ? "Modern accommodations designed for male students and professionals"
                          : "Safe and comfortable spaces for female students and professionals"}
                      </p>
                      <motion.button
                        className="text-white font-medium flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        Explore options
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            : [
                {
                  src: m2,
                  title: "Boys Hostel",
                  desc: "Modern accommodations designed for male students and professionals",
                },
                {
                  src: main_pic_1,
                  title: "Girls Hostel",
                  desc: "Safe and comfortable spaces for female students and professionals",
                },
              ].map((room, index) => (
                <motion.div
                  key={index}
                  className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index ? 0.2 : 0 }}
                  viewport={{ once: true }}
                  onClick={() => navigate("/accommodations")}
                >
                  <img
                    src={room.src}
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-2xl font-medium mb-2">
                        {room.title}
                      </h3>
                      <p className="text-white/80 mb-4">{room.desc}</p>
                      <motion.button
                        className="text-white font-medium flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        Explore options
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default RoomOptionsSection;
