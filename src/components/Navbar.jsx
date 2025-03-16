import React from "react";

export default function Navbar() {
  return (
    <div className="flex justify-around object-cover bg-black opacity-60 fixed w-full h-[40px] text-white text-2xl">
      <div>
        <div className="hover:cursor-pointer hover:scale-105">
          Klinik drg. Irna
        </div>
      </div>
      <div className="flex gap-10">
        <div className="hover:cursor-pointer hover:scale-105">Login</div>
        <div className="hover:cursor-pointer hover:scale-105">Login</div>
        <div className="hover:cursor-pointer hover:scale-105">Login</div>
      </div>
    </div>
  );
}
