using System;
using System.Collections.Generic;

namespace backend.Entities // Replace with your actual namespace
{
    public class Item
    {
        public int Id { get; set; }
        public string Creator_Id { get; set; }
        public string Name { get; set; }
        public float Price_Per_Cs { get; set; }
        public float Amt_Sold_Per_Cs { get; set; }
        public float Order_Sell_Price { get; set; }
        public float Profit_Per_Cs { get; set; }
        public string Category { get; set; }
        public string Vendor { get; set; }
        public User Creator { get; set; } // Navigation property
    }

    public class Category
    {
        public int Id { get; set; }
        public string Creator_Id { get; set; }
        public string Category_Name { get; set; }
        public User Creator { get; set; } // Navigation property
    }

    public class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<Item> Items { get; set; } // Navigation property
        public List<Category> Categories { get; set; } // Navigation property
    }
}
