import React, { createContext, useState, useContext } from 'react';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [statsData, setStatsData] = useState([]);

  const updateStatsData = (newData) => {
    setStatsData(newData);
  };

  return (
    <StatsContext.Provider value={{ statsData, updateStatsData }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsData = () => useContext(StatsContext);
