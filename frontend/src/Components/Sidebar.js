import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogoutUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5066/api/Authentication/Logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        navigate("/login");
      } else {
        console.log("Logout failed:", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="bottom-0 left-0 top-0 flex-col bg-surface/75 text-white justify-between sidebar-border-radius sidebar-drop-shadow w-1/5 p-4 md:flex min-w-fit h-screen"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <div>
        <h2 className="text-2xl font-bold ">ProfitGaurd</h2>
        <p className="mb-8"> by Belmont Tech</p>
        <div className="grid grid-cols-1">
          <ul className="space-y-2">
            <li>
              <Link
                className="font-extralight text-2xl hover:text-accent"
                to="/main"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className="font-extralight text-2xl hover:text-accent"
                to="/items"
              >
                Items
              </Link>
            </li>
            <li>
              <Link
                className="font-extralight text-2xl hover:text-accent"
                to="/items"
              >
                My List
              </Link>
            </li>
            <li>
              <Link
                className="font-extralight text-2xl hover:text-accent"
                to="/categories"
              >
                Categories
              </Link>
            </li>
            {/* Add more navigation links for other pages */}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Link className="font-extralight text-2xl" to="/categories">
          Settings
        </Link>
        {user.isLoggedIn === true ? (
          <button
            className="btn btn-warning font-extralight bg-gray-300 text-black px-4 py-2 rounded-md mr-2 hover:bg-gray-100 focus:outline-none focus:shadow-outline-gray"
            onClick={() => {
              handleLogoutUser();
              logoutUser();
              navigate("/login");
            }}
          >
            {" "}
            Logout{" "}
          </button>
        ) : (
          <button
            className="btn btn-warning font-extralight bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray"
            onClick={() => {
              navigate("/");
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
