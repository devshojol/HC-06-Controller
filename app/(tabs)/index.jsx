import { GlobalContext } from "@/context/GlobalContext";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BluetoothClassicDemo() {
  const [receivedData, setReceivedData] = useState([]);
  const [inputText, setInputText] = useState("");

  const {
    connectedDevice,
    setConnectedDevice,
    pairedDevices,
    setPairedDevices,
    sendData,
    sendCustomData,
    dataSubscription,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (connectedDevice) {
      dataSubscription.current = connectedDevice.onDataReceived((event) => {
        setReceivedData((prev) => [...prev, event.data]);
      });
    }
  }, [connectedDevice, inputText, receivedData, dataSubscription]);

  const listPairedDevices = async () => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      setPairedDevices(devices);
    } catch {
      Alert.alert("Can't find pair Devices");
    }
  };

  const connectToDevice = async (device) => {
    try {
      const isConnected = await device.connect({
        connectorType: "rfcomm",
        DELIMITER: "\n",
      });

      if (isConnected) {
        setConnectedDevice(device);
        dataSubscription.current = device.onDataReceived((event) => {
          setReceivedData((prev) => [...prev, event.data]);
        });
      }
    } catch (err) {
      Alert.alert("Connection failed", String(err));
    }
  };

  const disconnectDevice = async () => {
    if (!connectedDevice) return;
    if (dataSubscription.current) dataSubscription.current.remove();
    await connectedDevice.disconnect();
    setConnectedDevice(null);
    setReceivedData([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!connectedDevice ? (
        <View style={styles.deviceListContainer}>
          <Text style={styles.title}>HC-06 Bluetooth Controller</Text>
          <TouchableOpacity style={styles.scanButton} onPress={listPairedDevices}>
            <Text style={styles.scanButtonText}>Scan Paired Devices</Text>
          </TouchableOpacity>

          <FlatList
            style={styles.deviceList}
            data={pairedDevices}
            keyExtractor={(item) => item.address}
            numColumns={2}
            columnWrapperStyle={{ gap: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
                <Text style={styles.deviceName}>{item.name || "Unknown Device"}</Text>
                <Text style={styles.deviceAddress}>{item.address}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No paired devices found. Tap scan button above.</Text>}
          />
        </View>
      ) : (
        <KeyboardAvoidingView style={styles.connectedContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.connectedLabel}>Connected to:</Text>
              <Text style={styles.connectedDevice}>{connectedDevice.name || connectedDevice.address}</Text>
            </View>
            <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.sectionTitle}>Quick Commands</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity style={[styles.commandButton, styles.ledButton]} onPress={() => sendData("led")}>
                <Text style={styles.commandButtonText}>💡 LED</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.commandButton, styles.motorButton]} onPress={() => sendData("motor")}>
                <Text style={styles.commandButtonText}>⚙️ Motor</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.commandButton, styles.bipButton]} onPress={() => sendData("bip bip")}>
                <Text style={styles.commandButtonText}>🔔 Bip Bip</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.commandButton, styles.hiButton]} onPress={() => sendData("hi")}>
                <Text style={styles.commandButtonText}>👋 Hi</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.customInputSection}>
            <Text style={styles.sectionTitle}>Custom Command</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter custom command..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => sendCustomData(inputText, setInputText)}
              />
              <TouchableOpacity style={styles.sendButton} onPress={() => sendCustomData(inputText, setInputText)}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dataSection}>
            <Text style={styles.sectionTitle}>Received Data</Text>
            <ScrollView style={styles.dataScroll}>
              {receivedData.length === 0 ? (
                <Text style={styles.noDataText}>No data received yet...</Text>
              ) : (
                receivedData.map((data, index) => (
                  <View key={index} style={styles.dataItem}>
                    <Text style={styles.dataText}>{data}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  deviceListContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  scanButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    width: "50%",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 32,
    fontSize: 14,
  },
  connectedContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  connectedLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  connectedDevice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  disconnectButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disconnectButtonText: {
    color: "white",
    fontWeight: "600",
  },
  controlSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  commandButton: {
    width: "48%",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  ledButton: {
    backgroundColor: "#FFC107",
  },
  motorButton: {
    backgroundColor: "#4CAF50",
  },
  bipButton: {
    backgroundColor: "#9C27B0",
  },
  hiButton: {
    backgroundColor: "#FF5722",
  },
  commandButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  customInputSection: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    justifyContent: "center",
    borderRadius: 8,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  dataSection: {
    flex: 1,
  },
  dataScroll: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  noDataText: {
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  dataItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  dataText: {
    color: "#333",
    fontSize: 14,
  },
});
