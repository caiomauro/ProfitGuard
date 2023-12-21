import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
import { useCategoryData } from "../Context/CategoryContext";
import { useItemData } from "../Context/ItemContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

const Login = () => {
  const navigate = useNavigate();
  const { user, loginUser } = useUser();
  const { updateCategoryData } = useCategoryData();
  const { updateItemData } = useItemData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    // Make a request to your ASP.NET backend for authentication
    try {
      const response = await fetch(
        "http://localhost:5066/api/Authentication/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, rememberMe }),
        }
      );

      if (response.ok) {
        const userData = await response.json();

        // Update user context upon successful login
        loginUser({
          isLoggedIn: true,
          userId: userData.UserId,
          username: userData.Username,
          dateCreated: userData.DateCreated,
          token: userData.Token,
        });

        console.log(user);

        localStorage.setItem("token", userData.Token);

        /*
        const categoriesResponse = await fetch('http://localhost:5066/api/CategoryData/GetData', {
            headers: {
            'Authorization': `Bearer ${userData.Token}`,
            },
        });

        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            updateCategoryData(categoriesData);
        }

        const itemsResponse = await fetch('http://localhost:5066/api/ItemData/GetData', {
            headers: {
            'Authorization': `Bearer ${userData.Token}`,
            },
        });

        if (itemsResponse.ok) {
            const itemsData = await itemsResponse.json();
            updateItemData(itemsData);
        }
        */

        setLoading(false);
        navigate("/main");
      } else {
        // Handle authentication error
        setLoading(false);
        console.error("Authentication failed");
      }
    } catch (error) {
      setLoading(false);
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
        <form onSubmit={handleLogin}>
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
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4 flex items-center justify-between px-4">
            <p className="text-sm">
              No account? Register{" "}
              <a className="text-accent3 hover:underline font-semibold" href="/register">
                here
              </a>
              !
            </p>

            <div>
              <label
                htmlFor="rememberMe"
                className="text-gray-700 text-sm font-semibold mr-2"
              >
                Remember Me
              </label>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={toggleRememberMe}
                className="text-blue-500 focus:outline-none focus:shadow-outline-blue"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-accent px-4 py-2 rounded-md hover:underline focus:outline-none focus:shadow-outline-blue"
            >
              {loading ? (
                <Spinner aria-label="Default status example" />
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
