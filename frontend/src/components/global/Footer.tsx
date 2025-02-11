export default function Footer() {
  return (
    <footer className="bg-[#E6E6E6] px-10 py-8">
      <div className="container mx-auto grid grid-cols-4 gap-8 text-[#333]">
        {/* Left Section */}
        <div>
          <h2 className="text-base font-normal">My Space</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#333] max-w-xs">
            WDM&Co is a premier hotel booking website that offers a seamless and
            convenient way to find and book accommodations worldwide.
          </p>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-base font-normal">Company</h3>
          <ul className="mt-2 space-y-2 text-sm text-[#333]">
            <li>About Us</li>
            <li>Our Team</li>
            <li>Blog</li>
            <li>Book</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="text-base font-normal">Legal</h3>
          <ul className="mt-2 space-y-2 text-sm text-[#333]">
            <li>FAQs</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-base font-normal">Resources</h3>
          <ul className="mt-2 space-y-2 text-sm text-[#333]">
            <li>Social Media</li>
            <li>Help Center</li>
            <li>Partnerships</li>
          </ul>
        </div>
      </div>

      {/* Copyright at Bottom Right */}
      <div className="mt-6 flex justify-end text-sm text-[#333]">
        Copyright © 2024 All rights reserved.
      </div>
    </footer>
  );
}
