// MainPage.js
import React, { useState, useEffect } from "react";
import { useCategoryData } from "../Context/CategoryContext";
import { useItemData } from "../Context/ItemContext";
import { useUser } from "../Context/UserContext";
import Sidebar from "./Sidebar";

const CategoryPage = () => {
  const { categoryData, updateCategoryData } = useCategoryData();
  const { itemData, updateItemData } = useItemData();
  const { user } = useUser();
  const [Name, setName] = useState("");
  const [Price_Per_Cs, setPrice_Per_Cs] = useState("");
  const [Amt_Sold_Per_Cs, setAmt_Sold_Per_Cs] = useState("");
  const [Order_Sell_Price, setOrder_Sell_Price] = useState("");
  const [Category, setCategory] = useState("");
  const [Vendor, setVendor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const itemsResponse = await fetch(
          "http://localhost:5066/api/ItemData/GetData",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (itemsResponse.ok) {
          const itemData = await itemsResponse.json();
          await updateItemData(itemData);
        }
      } catch (error) {
        console.error("Error fetching and updating item data:", error);
      }
    };

    fetchData();
    handleLogCategoryData();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice_Per_Cs("");
    setAmt_Sold_Per_Cs("");
    setOrder_Sell_Price("");
    setCategory("");
    setVendor("");
  };

  const handleLogItemData = async () => {
    const token = localStorage.getItem("token");

    const itemsResponse = await fetch(
      "http://localhost:5066/api/ItemData/GetData",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (itemsResponse.ok) {
      const itemData = await itemsResponse.json();
      await updateItemData(itemData);
    }
  };

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

  const handlePostItemData = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Replace with your actual token key
    try {
      const response = await fetch(
        "http://localhost:5066/api/ItemData/PostData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams({
            Name: Name,
            Price_Per_Cs: Price_Per_Cs,
            Amt_Sold_Per_Cs: Amt_Sold_Per_Cs,
            Order_Sell_Price: Order_Sell_Price,
            Category: Category,
            Vendor: Vendor,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      handleLogItemData();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteItemData = async (itemId, itemName) => {
    const token = localStorage.getItem("token"); // Replace with your actual token key

    try {
      const response = await fetch(
        "http://localhost:5066/api/ItemData/DeleteData",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams({
            Name: itemName,
            Id: itemId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      handleLogItemData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sortByCategory = () => {
    const sortedItems = [...itemData].sort((a, b) =>
      a.Category.localeCompare(b.Category)
    );
    return sortedItems;
  };

  const alphaSortCategory = () => {
    const sortedCategory = [...categoryData].sort((a, b) =>
      a.Category_Name.localeCompare(b.Category_Name)
    );
    return sortedCategory;
  };

  const timeSinceLastUpdate = (item) => {
    const currentTime = new Date();
    const createdDate = new Date(item.Created_At);
    const timeDifference = currentTime - createdDate;
    const daysSinceReference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysSinceReference;

  }

  const sortedItems = sortByCategory();

  const sortedCategory = alphaSortCategory();

  return (
    <div className="flex custom-background-img">
      <Sidebar />
      <div className="max-h-screen grid grid-rows-3 grid-cols-2 mx-auto w-5/6 p-4 gap-2 overflow-hidden">
        <div
          className="flex flex-col p-4 w-full shadow-md row-span-2 rounded-2xl bg-surface text-white"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <form
            onSubmit={(e) => handlePostItemData(e)}
            className="flex flex-col p-4 w-full shadow-md row-span-2 rounded-2xl bg-surface text-white"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <h2 className="text-2xl rounded-md font-bold p-1 mb-4">
              New Item:
            </h2>

            <input
              placeholder="New Item Name"
              value={Name}
              required
              onChange={(e) => setName(e.target.value)}
              className="mb-2 p-2 bg-gray-600 placeholder-white rounded-md w-full"
            />

            <input
              placeholder="Price per case"
              value={Price_Per_Cs}
              required
              onChange={(e) => setPrice_Per_Cs(e.target.value)}
              className="mb-2 p-2 bg-gray-600 placeholder-white rounded-md w-full"
            />

            <input
              placeholder="Amount sold per case"
              value={Amt_Sold_Per_Cs}
              required
              onChange={(e) => setAmt_Sold_Per_Cs(e.target.value)}
              className="mb-2 p-2 bg-gray-600 placeholder-white rounded-md w-full"
            />

            <input
              placeholder="Order sell price"
              value={Order_Sell_Price}
              required
              onChange={(e) => setOrder_Sell_Price(e.target.value)}
              className="mb-2 p-2 bg-gray-600 placeholder-white rounded-md w-full"
            />

            <select
              value={Category}
              onChange={(e) => setCategory(e.target.value)}
              className="mb-2 p-2 bg-gray-600 placeholder-white rounded-md w-full"
              required
            >
              <option value="" disabled>
                Select an Item Category
              </option>
              {sortedCategory.map((category) => (
                <option key={category.id} value={category.Category_Name}>
                  {category.Category_Name}
                </option>
              ))}
            </select>

            <input
              placeholder="Item vendor"
              value={Vendor}
              required
              onChange={(e) => setVendor(e.target.value)}
              className="mb-2 p-2 bg-gray-600 placeholder-white rounded-md w-full"
            />

            <button
              type="submit"
              className="bg-accent/90 text-black px-4 py-2 rounded-md hover:bg-accent focus:outline-none focus:shadow-outline-blue"
            >
              Create
            </button>
          </form>
        </div>

        <div
          id="Contains List"
          className="flex flex-col mr-auto p-4 w-full bg-surface text-white rounded-2xl row-span-3"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <div className="w-full">
            <h2 className="text-2xl rounded-md font-bold p-1 mb-4">Items:</h2>
          </div>
          <div className="px-2 grid w-5/6 mr-2 grid-cols-4 font-bold">
            <p>Name</p>
            <p>Category</p>
            <p>Profit</p>
            <p>Vendor</p>
          </div>
          <div className="w-full border border-bottom border-accent3"></div>
          <div
            id="broken"
            className="w-full p-1 rounded-2xl flex-grow overflow-y-auto"
          >
            {sortedItems.map((item) => (
              
              <div key={item.id} className="flex w-5/6">
                <button
                  onClick={() => handleDeleteItemData(item.Id, item.Name)}
                  className="flex-grow text-left px-2 grid grid-cols-5 py-1 hover:bg-accent hover:text-black focus:outline-none border-b-2 border-indigo-500 font-semilight focus:shadow-outline-gray"
                >
                  <p>{item.Name}</p>
                  <p>{item.Category}</p>
                  <p>${item.Profit_Per_Cs}</p>
                  <p>{item.Vendor}</p>
                  <p>{timeSinceLastUpdate(item)}</p>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col gap-4 p-4 w-full shadow-md rounded-2xl bg-surface text-white"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <h2 className="text-2xl font-bold mb-4">Delete Item:</h2>
          <p className="text-md font-bold mb-4">
            {" "}
            To delete an item please click on one from the list of categories.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
