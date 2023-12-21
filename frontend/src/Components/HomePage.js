import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="mx-auto w-full h-screen custom-background-img shadow-md rounded-md text-center"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <div className="grid grid-cols-3 bg-gray-500 mb-2">
          <div></div>
          <h2 className="text-2xl text-white font-bold py-4">
            Welcome to Profit<span className="bg-gray-950 rounded-md text-accent px-1">Guard</span>{" "}
          </h2>
          <div className="ml-auto my-auto">
          <button
            className="ml-auto w-24 h-10 text-white my-auto mr-4 px-4 py-2 rounded-md hover:underline focus:outline-none focus:shadow-outline-blue"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            className="ml-auto w-24 h-10 text-white my-auto mr-4 px-4 py-2 rounded-md hover:underline focus:outline-none focus:shadow-outline-blue"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </button>
          </div>
        </div>
        <div className="container w-2/3 mx-auto p-4 mb-4 bg-gray-500 rounded-md">
          <div className="py-5 px-4">
            <h1 className="font-extralight text-white text-2xl text-center mb-3"> About </h1>
            <p className="font-extralight text-white text-lg text-left">
              ProfitGuard is an IPS (Internal Profit System) designed to be easy
              to use and effective. Our goal is to put more money in your pocket
              without needing more sales! Please login below to begin using
              ProfitGuard now!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
