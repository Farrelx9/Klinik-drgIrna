import React from "react";
import BG1 from "../assets/Original.jpg";
import LOGO from "../assets/—Pngtree—creative company_1420804.png";

export default function Login() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 shadow-xl">
        <img
          src={LOGO}
          className="w-32 h-auto mb-4 object-contain"
          style={{ maxWidth: "100%", maxHeight: "100px" }}
        />
        <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
        <p className="mb-6">Please enter your details</p>
        <input
          type="text"
          className="border p-2 mb-4 w-full"
          placeholder="Email address"
        />
        <input
          type="password"
          className="border p-2 mb-4 w-full"
          placeholder="Password"
        />
        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <span>Remember for 30 days</span>
        </div>
        <button className="bg-blue-500 text-white p-2 rounded w-full mb-4">
          Sign in
        </button>
        <button className="bg-white border border-blue-500 text-blue-500 p-2 rounded w-full mb-4">
          Sign in with Google
        </button>
        <div>
          <a href="#" className="text-blue-500">
            Forgot password?
          </a>
        </div>
        <div className="mt-4">
          <span>Don't have an account? </span>
          <a href="#" className="text-blue-500">
            Sign up
          </a>
        </div>
      </div>
      <div className="hidden md:block w-1/2 h-full items-center justify-center">
        <img
          src={BG1}
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
