# Agent Toolkit (ATK)

ProfitGuard is an internal profit management system. The goal is to allow my parents pizzeria to increase the net profit without a large investment into marketing to spike sales. ProfitGuard allows users to create an item category, steak, and then add items tied to that category with specific data like cost, sale price, orders per case and vendor. It will then compare items of the same category and compile a list that contains the most profitable items from the respective vendors. It will also show users their inventory total cost, total profit and, gross value.


<table>
  <tr>
    <td><img src="main.png" alt="Main Page" style="width:500px;"></td>
    <td><img src="completed.png" alt="Completed Tasks" style="width:500px;"></td>
  </tr>
  <tr>
    <td><img src="createpost.png" alt="Create Post" style="width:500px;"></td>
    <td><img src="login.png" alt="Login Page" style="width:500px;"></td>
  </tr>
</table>

## Installation

Use the dotnet package manager to install the required packages in the backend folder.

```bash
- dotnet add package MySql.Data
- dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson
- dotnet add package Microsoft.AspNetCore.Identity
- dotnet add package Pomelo.EntityFrameworkCore.MySql
- dotnet add package Microsoft.AspNetCore.Identity.UI
- dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
- dotnet add package Microsoft.EntityFrameworkCore.Design
- dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

Use npm install the required packages in the frontend folder.
```bash
- npm install react-router-dom
- npm install tailwindcss postcss autoprefixer
- npm install flowbite
- npm i flowbite-react
- npm install --save-dev @iconify/react
- npm install react-chartjs-2 chart.js
```

## Description

# Inventory Profit System (IPS)

Welcome to IPS – your go-to solution for efficient food inventory management and profit optimization. With IPS, you can seamlessly create an account, categorize food items, and track profits effortlessly. Take control of your culinary business with powerful features such as profit calculations, inventory analysis, and goal tracking. Maximize your profitability and streamline your operations with IPS. Let's revolutionize the way you manage your inventory!

## Features
User authentication and authorization
Item organization through user created categories
Seamless profit calculation from user input
Item comparisons to display highest profit item from specific vendor
Profit goal with progress bar

## Basic Usage
After installing the required dependencies head to ```/backend/appsettings.json``` and set your MySQL connection string. Then 
navigate ```/Program.cs (L24)``` and set the connection string to your specific one. Then open a terminal in the same directory and run the command ```bash dotnet run``` to begin the backend which hosts the API and connects to the database. 

Open up a new terminal in the root directory and navigate to ```/frontend``` and install the required dependencies. Open a terminal in the same directory and run ```npm start``` to begin the frontend which will interact with the API we started previously.

## License
This project is licensed under the MIT license.
