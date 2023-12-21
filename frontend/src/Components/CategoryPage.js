// MainPage.js
import React, { useState, useEffect } from "react";
import { useCategoryData } from "../Context/CategoryContext";
import { useUser } from "../Context/UserContext";
import Sidebar from "./Sidebar";
import { Tooltip } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CategoryPage = () => {
  const { categoryData, updateCategoryData } = useCategoryData();
  const { user } = useUser();
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const categoriesResponse = await fetch(
          "http://localhost:5066/api/CategoryData/GetData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          await updateCategoryData(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching and updating category data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogCategoryData = async () => {
    const token = localStorage.getItem("token");

    const categoriesResponse = await fetch(
      "http://localhost:5066/api/CategoryData/GetData",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      await updateCategoryData(categoriesData);
    }
  };

  const handlePostItemData = async () => {
    const token = localStorage.getItem("token"); // Replace with your actual token key

    if (newCategory.length > 0) {
      try {
        const response = await fetch(
          "http://localhost:5066/api/CategoryData/PostData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
            body: new URLSearchParams({
              Category_Name: newCategory,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        else if (response.ok) {
          handleLogCategoryData();
          setNewCategory("");
        }

      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDeleteItemData = async (itemId, itemName) => {
    const token = localStorage.getItem("token"); // Replace with your actual token key

    try {
      const response = await fetch(
        "http://localhost:5066/api/CategoryData/DeleteData",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams({
            Category_Name: itemName,
            Id: itemId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      handleLogCategoryData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex custom-background-img">
      <Sidebar />
      <div className="max-h-screen grid grid-rows-2 grid-cols-2 mx-auto w-5/6 p-4 gap-2 overflow-hidden">
        <div
          className="flex flex-col gap-4 p-4 w-full shadow-md rounded-2xl bg-surface text-white"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <h2 className="text-2xl rounded-md font-bold p-1 mb-4">
            New Category:
          </h2>

          <input
            placeholder="New Category Name"
            id="nameInput"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mb-2 p-2 bg-gray-600 placeholder-white rounded-md w-full"
          />

          <button
            onClick={handlePostItemData}
            type="button"
            data-tooltip-target="tooltip-light"
            data-tooltip-style="light"
            className="bg-accent/90 text-black px-4 py-2 rounded-md mr-2 hover:bg-accent focus:outline-none focus:shadow-outline-blue"
          >
            Create
          </button>
        </div>

        <div
          id="Contains List"
          className="flex flex-col mr-auto p-4 w-full bg-surface text-white rounded-2xl row-span-2"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <div className="w-full">
            <h2 className="text-2xl rounded-md font-bold p-1 mb-4">
              Categories:
            </h2>
          </div>
          <div className="px-5 grid w-3/5 grid-cols-2 font-bold">
            <p>Id</p>
            <p>Name</p>
          </div>
          <div className="w-full border border-bottom border-accent3"></div>
          <div
            id="broken"
            className="w-full p-1 rounded-2xl flex-grow overflow-y-auto"
          >
            {categoryData.map((category) => (
              <div key={category.id} className="flex w-3/5">
                <button
                  onClick={() =>
                    handleDeleteItemData(category.Id, category.Category_Name)
                  }
                  className="flex-grow text-left px-3 grid grid-cols-2 px-2 rounded-md py-1 mr-2 hover:bg-accent hover:text-black focus:outline-none font-semilight focus:shadow-outline-gray"
                >
                  <p>#{category.Id}</p>
                  <p>{category.Category_Name}</p>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col gap-4 p-4 w-full shadow-md rounded-2xl bg-surface text-white"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <h2 className="text-2xl font-bold mb-4">Delete Category:</h2>
          <p className="text-md font-bold mb-4"> To delete a category please click on one from the list of categories. </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
