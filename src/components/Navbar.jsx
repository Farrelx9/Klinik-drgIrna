import React from "react";

export default function Navbar() {
  return (
    <div className="flex justify-around object-cover bg-black opacity-60 fixed w-full text-white text-2xl">
      <div>
        <div>Klinik drg. Irna</div>
      </div>
      <div className="flex gap-10">
        <div>Login</div>
        <div>Login</div>
        <div>Login</div>
      </div>
    </div>
  );
}
