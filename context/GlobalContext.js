import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [connectedDevice, setConnectedDevice] = useState(null);

  const value = { connectedDevice, setConnectedDevice };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};
