import React, { createContext, useState, useContext, useEffect } from "react";

const CategoryDataContext = createContext();

export const CategoryDataProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState([]);

  const updateCategoryData = (newData) => {
    setCategoryData(newData);
  };

  useEffect(() => {
    updateCategoryData([]);
  }, []);

  return (
    <CategoryDataContext.Provider value={{ categoryData, updateCategoryData }}>
      {children}
    </CategoryDataContext.Provider>
  );
};

export const useCategoryData = () => useContext(CategoryDataContext);
