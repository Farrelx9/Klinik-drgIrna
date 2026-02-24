import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

const ServiceCard = ({ title, description, icon, link, badgeCount = 0 }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      e.preventDefault(); // Mencegah navigasi
      toast.info("Anda harus login terlebih dahulu", {
        autoClose: 3000,
      });
    } else {
      navigate(link); // Navigasi jika sudah login
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow relative">
      {badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 h-10 w-10 bg-red-500 text-white text-md font-bold rounded-full flex items-center justify-center border-2 border-white z-10 animate-pulse">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
      <div className="text-[#1B56FD] text-3xl">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <button
        onClick={handleClick}
        className="ml-auto text-[#1B56FD]"
        type="button"
      >
        <FaArrowRight size={25} />
      </button>
    </div>
  );
};

export default ServiceCard;
