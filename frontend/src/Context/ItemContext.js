import React, { createContext, useState, useContext, useEffect } from 'react';

const ItemDataContext = createContext();

export const ItemDataProvider = ({ children }) => {
  const [itemData, setItemData] = useState([]);

  const updateItemData = (newData) => {
    setItemData(newData);
  };

  useEffect(() => {
    updateItemData([]);
  }, []);

  return (
    <ItemDataContext.Provider value={{ itemData, updateItemData }}>
      {children}
    </ItemDataContext.Provider>
  );
};

export const useItemData = () => useContext(ItemDataContext);
