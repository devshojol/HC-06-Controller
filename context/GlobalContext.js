import { createContext, useRef, useState } from "react";
import { Alert } from "react-native";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [pairedDevices, setPairedDevices] = useState(null);
  const dataSubscription = useRef(null);

  const sendData = async (text) => {
    if (!connectedDevice) {
      Alert.alert("Not connected", "Please connect to a device first.");
      return;
    }
    try {
      await connectedDevice.write(text);
      console.log(text);
    } catch (err) {
      console.log(err);
      Alert.alert("Send failed");
    }
  };

  const sendCustomData = (inputText, setInputText) => {
    if (inputText.trim()) {
      sendData(inputText);
      setInputText("");
      console.log(inputText.trim());
    }
  };

  const value = {
    connectedDevice,
    setConnectedDevice,
    pairedDevices,
    setPairedDevices,
    sendData,
    sendCustomData,
    dataSubscription,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};
