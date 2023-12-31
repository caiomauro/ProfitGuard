// MainPage.js
import React, { useState, useEffect } from "react";
import { useCategoryData } from "../Context/CategoryContext";
import { useItemData } from "../Context/ItemContext";
import { useUser } from "../Context/UserContext";
import Sidebar from "./Sidebar";
import { Progress } from "flowbite-react";

const MainPage = () => {
  const { categoryData, updateCategoryData } = useCategoryData();
  const { itemData, updateItemData } = useItemData();
  const { user } = useUser();
  const [newCategory, setNewCategory] = useState("");
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState("");
  const [goal, setGoal] = useState();
  const [userGoal, setUserGoal] = useState();
  const [goalInputVal, setGoalInputVal] = useState("");
  const [showSetGoal, setShowGoal] = useState(false);

  useEffect(() => {
    handleLogItemData();
    handleLogCategoryData();
    getUserInfo();
  }, []);

  const resetState = () => {
    setGoal("");
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
      console.log("Item Data", itemData);
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
      console.log("Category Data:", categoriesData);
    }
  };

  const setProfitGoal = async () => {
    const token = localStorage.getItem("token"); // Replace with your actual token key
    const parsedGoal = parseFloat(goal);

    if (goal >= 1) {
      setGoalInputVal("")
      try {
        console.log("sending: ", parsedGoal);
        const response = await fetch(
          "http://localhost:5066/api/CategoryData/SetGoal",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
            body: new URLSearchParams({
              profit_goal: parsedGoal,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else if (response.ok) {
          console.log(parseFloat(goal));
          console.log("Goal set @: ", goal);
          getUserInfo();
          resetState();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setGoalInputVal("Please enter a number greater than 0.")
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5066/api/CategoryData/GetUserInfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else if (response.ok) {
        const goalData = await response.json();
        setUserGoal(goalData[0].profit_goal);
        console.log("Goal value @ = ", goalData[0].profit_goal);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getTotalProfits = () => {
    const categoryMap = new Map();
    let totalProfit = 0;

    // Iterate through items without sorting
    itemData.forEach((item) => {
      const category = item.Category;

      // If the category is not in the map or the profit is higher than the current stored item, update the map
      if (
        !categoryMap.has(category) ||
        item.Profit_Per_Cs > categoryMap.get(category).Profit_Per_Cs
      ) {
        categoryMap.set(category, item);
      }
    });

    // Iterate through the values of categoryMap and accumulate the profits
    categoryMap.forEach((item) => {
      totalProfit += item.Profit_Per_Cs;
    });

    let formattedNumber = totalProfit.toFixed(2);
    console.log("totalProfit:", formattedNumber);
    return formattedNumber;
  };

  const getTotalSpending = () => {
    const categoryMap = new Map();
    let totalSpending = 0;

    // Iterate through sorted items
    itemData.forEach((item) => {
      const category = item.Category;

      // If the category is not in the map or the profit is higher than the current stored item, update the map
      if (
        !categoryMap.has(category) ||
        item.Profit_Per_Cs > categoryMap.get(category).Profit_Per_Cs
      ) {
        categoryMap.set(category, item);
      }
    });

    categoryMap.forEach((item) => {
      totalSpending += item.Price_Per_Cs;
    });

    let formattedNumber = totalSpending.toFixed(2);
    console.log("totalSpending:", formattedNumber);
    return formattedNumber;
  };

  const getTotalIncome = () => {
    const categoryMap = new Map();
    let totalIncome = 0;

    // Iterate through items without sorting
    itemData.forEach((item) => {
      const category = item.Category;

      // If the category is not in the map or the profit is higher than the current stored item, update the map
      if (
        !categoryMap.has(category) ||
        item.Profit_Per_Cs > categoryMap.get(category).Profit_Per_Cs
      ) {
        categoryMap.set(category, item);
      }
    });

    // Iterate through the values of categoryMap and accumulate the profits
    categoryMap.forEach((item) => {
      totalIncome += item.Order_Sell_Price * item.Amt_Sold_Per_Cs;
    });

    let formattedNumber = totalIncome.toFixed(2);
    console.log("totalIncome:", formattedNumber);
    return formattedNumber;
  };

  // Assuming each item object has a 'profit' property
  const getHighestProfitItems = () => {
    // Assuming itemData is an array of items
    const categoryMap = new Map();

    // Sort items by profit in descending order
    const sortedItems = [...itemData].sort(
      (a, b) => b.Profit_Per_Cs - a.Profit_Per_Cs
    );

    // Iterate through sorted items
    sortedItems.forEach((item) => {
      const category = item.Category;

      // If the category is not in the map or the profit is higher than the current stored item, update the map
      if (
        !categoryMap.has(category) ||
        item.Profit_Per_Cs > categoryMap.get(category).Profit_Per_Cs
      ) {
        categoryMap.set(category, item);
      }
    });

    const result = Array.from(categoryMap.values());

    console.log("Highest Profit Items (One per category):", result);
    return result;
  };

  const toggleSetGoal = () => {
    setShowGoal(!showSetGoal);
  };

  // Inside your component, you can call this function to get the highest profit items
  const highestProfitItems = getHighestProfitItems();

  const totalProfit = getTotalProfits();

  const percentToGoal = Math.floor((totalProfit / userGoal) * 100);

  const totalSpending = getTotalSpending();

  const totalIncome = getTotalIncome();

  const progressBarText = <p className="text-lg">{"You have completed " + percentToGoal + "%" + "  " + "Current goal: $" + userGoal}</p>;

  return (
    <div className="flex custom-background-img">
      <Sidebar />
      <div className="grid grid-rows-2 grid-cols-2 w-5/6 p-4 gap-4">
        <div
          className="flex flex-col mr-auto p-4 w-full bg-surface text-white rounded-2xl"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <h2 className="text-2xl font-bold mb-4">Profits Breakdown:</h2>

          <div className="w-full border border-bottom border-accent3"></div>

          <div className="w-full p-1 rounded-2xl flex-grow overflow-y-auto">
            <div className="flex grid grid-cols-1 rounded-md">
              <p className="flex-grow text-left text-lg px-3 grid px-2 py-1 mr-2 focus:outline-none font-semilight focus:shadow-outline-gray">
                Total Profit: <p className="text-green-400">${totalProfit}</p>
              </p>
              <p className="flex-grow text-left text-lg px-3 grid px-2 py-1 mr-2 focus:outline-none font-semilight focus:shadow-outline-gray">
                Inventory Cost: <p className="text-red-400">${totalSpending}</p>
              </p>
              <p className="flex-grow text-left text-lg px-3 grid px-2 py-1 mr-2 focus:outline-none font-semilight focus:shadow-outline-gray">
                Net Inventory Value:{" "}
                <p className="text-orange-400">${totalIncome}</p>
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col mr-auto p-4 w-full bg-surface text-white rounded-2xl"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <h2 className="text-2xl font-bold mb-4">Profit Goal:</h2>

          <div className="w-full border border-bottom border-accent3 mb-5"></div>

          <div className="w-full p-1 rounded-2xl flex-grow overflow-y-auto">
            <div className="flex grid grid-cols-1 rounded-md">
              <Progress
                progress={percentToGoal}
                progressLabelPosition="center"
                size="xl"
                labelProgress
                textLabel={progressBarText}
                textLabelPosition="outside"
                labelText
              />
              <p className="text-red-400 py-2">{goalInputVal}</p>
              {showSetGoal ? (
              <div className="flex flex-row flex-start items-center gap-4">
                <input
                  value={goal}
                  required
                  onChange={(e) => setGoal(e.target.value)}
                  className="p-2 bg-gray-600 placeholder-white/35 rounded-md w-3/5"
                />
                <button
                  className="hover:underline text-center bg-gray-500 p-2 rounded-md"
                  onClick={() => setProfitGoal()}
                >
                  Set Goal
                </button>
                <button
                  className="hover:underline text-center bg-gray-500 p-2 rounded-md"
                  onClick={toggleSetGoal}
                >
                  Hide
                </button>
              </div>
              ) : (
                <button
                className="hover:underline text-center bg-gray-500 p-2 rounded-md"
                onClick={toggleSetGoal}
              >
                Set Goal
              </button>
              )}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col mr-auto p-4 w-full bg-surface text-white rounded-2xl"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <h2 className="text-2xl font-bold mb-4">Highest Profit Items:</h2>
          <div className="px-5 grid grid-cols-3 font-bold">
            <p>Id</p>
            <p>Profit</p>
            <p>Vendor</p>
          </div>

          <div className="w-full border border-bottom border-accent3"></div>

          <div className="w-full p-1 rounded-2xl flex-grow overflow-y-auto">
            {highestProfitItems.map((item) => (
              <div key={item.Id} className="flex">
                <button className="flex-grow text-left px-3 grid grid-cols-3 px-2 rounded-md py-1 mr-2 focus:outline-none font-semilight focus:shadow-outline-gray">
                  <p className="text-lg">{item.Name}</p>
                  <p className="text-green-400 text-lg">
                    ${item.Profit_Per_Cs}/cs
                  </p>
                  <p className="text-lg">{item.Vendor}</p>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col mr-auto p-4 w-full bg-surface text-white rounded-2xl"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <p className="font-bold text-md m-4">If you would like to request a feature or report a bug please contact me on <a className="underline" href="https://www.linkedin.com/in/caiomauro/" target="_blank">linkedin</a>!</p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
