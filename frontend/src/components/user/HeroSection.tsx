import m1 from "../../../assets/user/m1.jpg";

interface HeroSectionProps {
  title?: string;
}

export const HeroSection = ({ title = "dream stay" }: HeroSectionProps) => {
  return (
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
          {title}
        </h1>
      </div>
    </section>
  );
};

export default HeroSection; 