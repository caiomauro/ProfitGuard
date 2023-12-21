import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
import { useCategoryData } from "../Context/CategoryContext";
import { useItemData } from "../Context/ItemContext";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Spinner } from "flowbite-react";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    // Make a request to your ASP.NET backend for authentication
    try {
      const response = await fetch(
        "http://localhost:5066/api/Authentication/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (response.ok) {
        setLoading(false);
        navigate("/login");
      } else {
        // Handle authentication error
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="p-4 custom-background-img h-screen">
      <div
        className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <h2 className="text-center text-2xl font-bold mb-4">
          Profit
          <span className="bg-gray-950 rounded-md text-accent px-1">Gaurd</span>{" "}
          by Belmont Tech
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onBlur={() => setShowPassword(false)}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
              >
                {showPassword ? (
                  <Icon icon="el:eye-close" />
                ) : (
                  <Icon icon="el:eye-open" />
                )}
              </button>
            </div>

            <label
              htmlFor="confirm-password"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onBlur={() => setShowConfirmPassword(false)}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  passwordsMatch ? "border-gray-300" : "border-red-500"
                } focus:border-blue-500`}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
              >
                {showConfirmPassword ? (
                  <Icon icon="el:eye-close" />
                ) : (
                  <Icon icon="el:eye-open" />
                )}
              </button>
            </div>

            {!passwordsMatch && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          <div className="mb-4 flex items-center px-4 ">
            <p className="text-sm">
              Have an account? Login{" "}
              <a className="text-accent3 font-semibold" href="/login">
                here
              </a>
              !
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              {loading ? (
                <Spinner aria-label="Default status example" />
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
