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
        <div className="grid grid-cols-3 bg-gray-500/50 border-b border-yellow-500 mb-4 h-20">
          <div></div>
          <div className="flex items-center justify-center">
          <h2 className="text-2xl text-white font-bold py-4">
            Welcome to Profit
            <span className="bg-gray-950 rounded-md text-accent px-1">
              Guard
            </span>{" "}
          </h2>
          </div>
          <div className="ml-auto my-auto">
            <button
              className="font-semibold text-lg ml-auto w-24 h-10 text-white my-auto mr-4 px-4 py-2 rounded-md hover:underline focus:outline-none focus:shadow-outline-blue"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
            <button
              className="ml-auto font-semibold text-lg w-24 h-10 text-white my-auto mr-4 px-4 py-2 rounded-md hover:underline focus:outline-none focus:shadow-outline-blue"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full h-5/6 mx-auto p-4 mb-4 bg-gray-500/50 items-center">
          <div className="flex flex-col items-center py-5 justify-center mb-4">
            <h1 className="font-semibold text-white text-2xl px-4 py-1 rounded-t-md text-center">
              {" "}
              What is ProfitGuard?{" "}
            </h1>
            <div className="w-5/6 p-4 rounded-md bg-gray-600 shadow-lg">
              <p className="font-extralight text-white p-4 rounded-md text-lg text-left">
                ProfitGuard is an IPS (Internal Profit System) designed to be easy
                to use and effective. Our goal is to put more money in your pocket
                without needing more sales! Please login below to begin using
                ProfitGuard now!
              </p>
            </div>
          </div>
          <div id="img-container" className="w-5/6 flex flex-row rounded-md bg-gray-600 shadow-lg items-center justify-between p-4 rounded-md">
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://i.imgur.com/3pwLRSO.png"
                width="200"
                height="200"
              ></img>
              <label className="font-extralight w-2/3 text-center text-white text-lg text-left">
                Quickly increase your businesses profit margin
              </label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://i.imgur.com/9tvPpSx.png"
                width="336"
                height="336"
              ></img>
              <label className="font-extralight w-2/3 text-center text-white text-lg text-left">
                Manage similar items from differenct vendors efficiently
              </label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://i.imgur.com/8Xg59Zk.png"
                width="218"
                height="218"
              ></img>
              <label className="font-extralight w-2/3 text-center text-white text-lg text-left">
                View important information about your business
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
