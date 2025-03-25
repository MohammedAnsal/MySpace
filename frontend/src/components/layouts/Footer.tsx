export default function Footer() {
  return (
    <footer className="font-dm_sans bg-[#E2E1DF] py-10 border-t-2 border-black">
      <div className="container w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 text-[#333]">
        {/* Left Section */}
        <div className="max-w-sm">
          <h2 className="text-xl">My Space</h2>
          <p className="mt-2 text-sm leading-relaxed">
            WDM&Co is a premier hotel booking website that offers a seamless and
            convenient way to find and book accommodations worldwide.
          </p>
        </div>

        {/* Company Section */}
        <div className="text-left">
          <h3 className="text-base font-normal">Company</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>About Us</li>
            <li>Our Team</li>
            <li>Blog</li>
            <li>Book</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="text-left">
          <h3 className="text-base font-normal">Legal</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>FAQs</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Resources Section */}
        <div className="text-left">
          <h3 className="text-base font-normal">Resources</h3>
          <ul className="mt-2 space-y-3 text-sm">
            <li>Social Media</li>
            <li>Help Center</li>
            <li>Partnerships</li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 text-center lg:text-right pr-4 text-sm text-[#333]">
        Copyright © 2024 All rights reserved.
      </div>
    </footer>
  );
}
