// MonthContext.js
import { createContext, useState } from 'react';

export const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(3);

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
};
