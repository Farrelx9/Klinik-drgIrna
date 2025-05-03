import React, { useState, useEffect } from "react";
import Logo from "../assets/images/LogoKlinik.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      setScrolled(!isScrollingUp);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 transform ${
        scrolled ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="bg-white bg-opacity-95 shadow-md rounded-b-xl">
        <div className="container mx-auto max-w-[85rem] px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={Logo}
                alt="logo"
                className="h-8 w-auto hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 font-poppins">
              <a
                href="#"
                className="text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
              >
                Tentang Kami
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
              >
                Pelayanan
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-[#1B56FD] transition-colors font-medium"
              >
                Testimoni
              </a>
              <button className="bg-[#1B56FD] text-white px-6 py-2 rounded-full hover:bg-[#0A2472] transition-colors font-medium">
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-[#1B56FD] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
