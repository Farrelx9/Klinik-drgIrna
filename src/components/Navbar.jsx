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
    <div
      className={`flex justify-around object-cover fixed py-1 px-2 w-full h-[40px] rounded-b-md text-black text-2xl transition-all duration-300 transform ${
        scrolled ? "-translate-y-full" : "translate-y-0"
      } bg-white bg-opacity-75 shadow-xl`}
    >
      <div>
        <img
          src={Logo}
          alt="logo"
          className="h-7 w-auto hover:cursor-pointer hover:scale-105"
        />
      </div>
      <div className="flex gap-10 font-poppins font-medium text-xl">
        <div className="hover:cursor-pointer hover:scale-105">Login</div>
        <div className="hover:cursor-pointer hover:scale-105">Login</div>
        <div className="hover:cursor-pointer hover:scale-105">Login</div>
      </div>
    </div>
  );
}
