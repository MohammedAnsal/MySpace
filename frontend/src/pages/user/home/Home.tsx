export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16">
      {/* Hero Section */}
      <section className="relative mb-16 pt-10">
        <h1 className="mb-8 text-center font-serif text-6xl font-light italic tracking-[0.2em] md:text-7xl">
          dream stay
        </h1>
        <div className="relative mx-auto aspect-[16/9] max-w-3xl overflow-hidden rounded-lg">
          <img
            src="/images/hero-bed.jpg"
            alt="Minimalist bedroom with wooden furniture"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </section>

      {/* Room Options Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-xl font-light">
          Decide Your Stay
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            { src: "/images/room1.jpg", title: "Comfy Haven" },
            { src: "/images/room2.jpg", title: "Homely Stay" },
            { src: "/images/room3.jpg", title: "The Cozy Corner" },
          ].map((room, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md">
              <div className="relative aspect-[4/3]">
                <img
                  src={room.src}
                  alt={room.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-center font-light">{room.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Boxes Section */}
      <section className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[#D4B595] rounded-lg p-6 text-white shadow-md">
            <p>
              "Your perfect stay awaits—where comfort meets convenience."
              <br />
              For boys, for girls, for everyone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/room1.jpg"
              alt="Comfy room preview"
              className="rounded-lg object-cover w-full h-full"
              loading="lazy"
            />
            <img
              src="/images/room4.jpg"
              alt="Big Home preview"
              className="rounded-lg object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
        <div className="bg-[#D4B595] rounded-lg p-6 text-white shadow-md">
          <p>
            "Find your perfect place to stay—where comfort, convenience, and
            community come together."
            <br />
            <br />
            Whether you're seeking hostel rooms or guest houses, or shared
            living, we're here to help you create lasting memories in a home
            away from home. ❤️
          </p>
        </div>
      </section>
    </main>
  );
}
