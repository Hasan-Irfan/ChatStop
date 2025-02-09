import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6">
      <div className="container mx-auto text-center">
        {/* Top Section: Logo and Links */}
        <div className="mb-4">
          {/* Logo */}
          <div className="mb-4">
            <img
              src="/logo.png" // Replace with your logo path
              alt="Your Logo"
              className="mx-auto w-20"
            />
          </div>
          {/* Navigation Links */}
          <nav className="flex justify-center gap-6 text-sm">
            <a href="/about" className="hover:text-black transition">
              About Us
            </a>
            <a href="/contact" className="hover:text-black transition">
              Contact Us
            </a>
            <a href="/faq" className="hover:text-black transition">
              FAQ
            </a>
            <a href="/terms" className="hover:text-black transition">
              Terms of Service
            </a>
            <a href="/privacy" className="hover:text-black transition">
              Privacy Policy
            </a>
          </nav>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Bottom Section: Copyright and Policies */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-2 md:mb-0">&copy; 2024 ChatStop. All Rights Reserved.</p>
          <nav className="flex gap-6">
            <a href="/privacy" className="hover:text-black transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-black transition">
              Terms of Service
            </a>
            <a href="/cookies" className="hover:text-black transition">
              Cookies Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
