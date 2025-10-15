import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, PermissionsAndroid, Platform, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BluetoothCarController() {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("deviceList"); // "deviceList" or "controller"
  const [speed, setSpeed] = useState(50);
  const dataSubscription = useRef(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      requestBluetoothPermissions();
    }

    return () => {
      if (dataSubscription.current) dataSubscription.current.remove();
      if (connectedDevice) connectedDevice.disconnect();
    };
  }, []);

  const requestBluetoothPermissions = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ]);
  };

  const listPairedDevices = async () => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      setPairedDevices(devices);
      console.log("Paired devices:", devices);
    } catch (err) {
      console.error("Error listing paired devices:", err);
      Alert.alert("Error", String(err));
    }
  };

  const connectToDevice = async (device) => {
    try {
      const isConnected = await device.connect({
        connectorType: "rfcomm",
        DELIMITER: "\n",
      });

      if (isConnected) {
        console.log("Connected to:", device.name);
        setConnectedDevice(device);
        setCurrentScreen("controller");

        dataSubscription.current = device.onDataReceived((event) => {
          console.log("Received:", event.data);
        });
      }
    } catch (err) {
      console.error("Connection failed:", err);
      Alert.alert("Connection failed", String(err));
    }
  };

  const disconnectDevice = async () => {
    if (!connectedDevice) return;
    try {
      if (dataSubscription.current) dataSubscription.current.remove();
      await connectedDevice.disconnect();
      setConnectedDevice(null);
      setCurrentScreen("deviceList");
      setSpeed(50);
      console.log("Disconnected successfully");
    } catch (err) {
      console.error("Disconnect failed:", err);
    }
  };

  const sendCommand = async (command) => {
    if (!connectedDevice) {
      Alert.alert("Not connected", "Please connect to a device first.");
      return;
    }
    try {
      await connectedDevice.write(command);
      console.log("Command sent:", command);
    } catch (err) {
      console.error("Send failed:", err);
      Alert.alert("Send failed", String(err));
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    sendCommand(`SPEED:${newSpeed}`);
  };

  // Device List Screen
  if (currentScreen === "deviceList") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.deviceListContainer}>
          <Text style={styles.title}>HC-06 Car Controller</Text>
          <TouchableOpacity style={styles.scanButton} onPress={listPairedDevices}>
            <Text style={styles.scanButtonText}>Scan Paired Devices</Text>
          </TouchableOpacity>

          <FlatList
            style={styles.deviceList}
            data={pairedDevices}
            keyExtractor={(item) => item.address}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
                <Text style={styles.deviceName}>{item.name || "Unknown Device"}</Text>
                <Text style={styles.deviceAddress}>{item.address}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No paired devices found. Tap scan button above.</Text>}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Car Controller Screen
  return (
    <SafeAreaView style={styles.controllerContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={disconnectDevice}>
          <Text style={styles.backButtonText}>← Disconnect</Text>
        </TouchableOpacity>
        <Text style={styles.titleWhite}>Car Remote</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>Connected: {connectedDevice?.name || connectedDevice?.address}</Text>
      </View>

      {/* Speed Control */}
      <View style={styles.speedSection}>
        <Text style={styles.speedLabel}>Speed: {speed}%</Text>
        <View style={styles.speedButtons}>
          <TouchableOpacity style={styles.speedButton} onPress={() => handleSpeedChange(Math.max(0, speed - 10))}>
            <Text style={styles.speedButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.speedBar}>
            {[25, 50, 75, 100].map((value) => (
              <TouchableOpacity
                key={value}
                style={[styles.speedPreset, speed >= value && styles.speedPresetActive]}
                onPress={() => handleSpeedChange(value)}>
                <Text style={styles.speedPresetText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.speedButton} onPress={() => handleSpeedChange(Math.min(100, speed + 10))}>
            <Text style={styles.speedButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Direction Controls */}
      <View style={styles.controlArea}>
        {/* Forward Button */}
        <View style={styles.forwardRow}>
          <TouchableOpacity
            style={[styles.directionButton, styles.forwardButton]}
            onPressIn={() => sendCommand("FORWARD")}
            onPressOut={() => sendCommand("STOP")}>
            <Text style={styles.directionIcon}>▲</Text>
            <Text style={styles.directionText}>Forward</Text>
          </TouchableOpacity>
        </View>

        {/* Left, Stop, Right Row */}
        <View style={styles.middleRow}>
          <TouchableOpacity
            style={[styles.directionButton, styles.leftButton]}
            onPressIn={() => sendCommand("LEFT")}
            onPressOut={() => sendCommand("STOP")}>
            <Text style={styles.directionIcon}>◄</Text>
            <Text style={styles.directionText}>Left</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.directionButton, styles.stopButton]} onPress={() => sendCommand("STOP")}>
            <Text style={styles.stopIcon}>■</Text>
            <Text style={styles.directionText}>Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.directionButton, styles.rightButton]}
            onPressIn={() => sendCommand("RIGHT")}
            onPressOut={() => sendCommand("STOP")}>
            <Text style={styles.directionIcon}>►</Text>
            <Text style={styles.directionText}>Right</Text>
          </TouchableOpacity>
        </View>

        {/* Backward Button */}
        <View style={styles.backwardRow}>
          <TouchableOpacity
            style={[styles.directionButton, styles.backwardButton]}
            onPressIn={() => sendCommand("BACKWARD")}
            onPressOut={() => sendCommand("STOP")}>
            <Text style={styles.directionIcon}>▼</Text>
            <Text style={styles.directionText}>Backward</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={[styles.actionButton, styles.hornButton]} onPress={() => sendCommand("HORN")}>
          <Text style={styles.actionIcon}>🔊</Text>
          <Text style={styles.actionText}>Horn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.lightButton]} onPress={() => sendCommand("LIGHT")}>
          <Text style={styles.actionIcon}>💡</Text>
          <Text style={styles.actionText}>Light</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.turboButton]} onPress={() => sendCommand("TURBO")}>
          <Text style={styles.actionIcon}>⚡</Text>
          <Text style={styles.actionText}>Turbo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Device List Styles
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
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
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

  // Controller Styles
  controllerContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#16213e",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#00d4ff",
    fontSize: 16,
    fontWeight: "600",
  },
  titleWhite: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  placeholder: {
    width: 100,
  },
  statusBar: {
    backgroundColor: "#0f3460",
    padding: 12,
    alignItems: "center",
  },
  statusText: {
    color: "#00d4ff",
    fontSize: 14,
    fontWeight: "500",
  },
  speedSection: {
    padding: 20,
    backgroundColor: "#16213e",
    margin: 16,
    borderRadius: 12,
  },
  speedLabel: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  speedButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  speedButton: {
    backgroundColor: "#00d4ff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  speedButtonText: {
    color: "#1a1a2e",
    fontSize: 28,
    fontWeight: "bold",
  },
  speedBar: {
    flexDirection: "row",
    flex: 1,
    marginHorizontal: 12,
    justifyContent: "space-around",
  },
  speedPreset: {
    backgroundColor: "#0f3460",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#0f3460",
  },
  speedPresetActive: {
    backgroundColor: "#00d4ff",
    borderColor: "#00d4ff",
  },
  speedPresetText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  controlArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  forwardRow: {
    alignItems: "center",
    marginBottom: 12,
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  backwardRow: {
    alignItems: "center",
  },
  directionButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  forwardButton: {
    backgroundColor: "#4CAF50",
  },
  leftButton: {
    backgroundColor: "#2196F3",
  },
  rightButton: {
    backgroundColor: "#2196F3",
  },
  backwardButton: {
    backgroundColor: "#FF9800",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  directionIcon: {
    fontSize: 32,
    color: "#ffffff",
    marginBottom: 4,
  },
  stopIcon: {
    fontSize: 28,
    color: "#ffffff",
    marginBottom: 4,
  },
  directionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#16213e",
  },
  actionButton: {
    width: 100,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  hornButton: {
    backgroundColor: "#9C27B0",
  },
  lightButton: {
    backgroundColor: "#FFC107",
  },
  turboButton: {
    backgroundColor: "#FF5722",
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
