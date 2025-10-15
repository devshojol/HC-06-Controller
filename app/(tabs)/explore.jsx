import { GlobalContext } from "@/context/GlobalContext";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BluetoothCarController() {
  const { connectedDevice, sendData } = useContext(GlobalContext);
  const [speed, setSpeed] = useState(50);

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    sendData(`SPEED:${newSpeed}`);
  };

  return (
    <SafeAreaView style={styles.controllerContainer}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Car Remote Connected With: {connectedDevice?.name || connectedDevice?.address}
        </Text>
      </View>

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
            onPressIn={() => sendData("FORWARD")}
            onPressOut={() => sendData("STOP")}>
            <Text style={styles.directionIcon}>▲</Text>
            <Text style={styles.directionText}>Forward</Text>
          </TouchableOpacity>
        </View>

        {/* Left, Stop, Right Row */}
        <View style={styles.middleRow}>
          <TouchableOpacity
            style={[styles.directionButton, styles.leftButton]}
            onPressIn={() => sendData("LEFT")}
            onPressOut={() => sendData("STOP")}>
            <Text style={styles.directionIcon}>◄</Text>
            <Text style={styles.directionText}>Left</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.directionButton, styles.stopButton]} onPress={() => sendData("STOP")}>
            <Text style={styles.stopIcon}>■</Text>
            <Text style={styles.directionText}>Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.directionButton, styles.rightButton]}
            onPressIn={() => sendData("RIGHT")}
            onPressOut={() => sendData("STOP")}>
            <Text style={styles.directionIcon}>►</Text>
            <Text style={styles.directionText}>Right</Text>
          </TouchableOpacity>
        </View>

        {/* Backward Button */}
        <View style={styles.backwardRow}>
          <TouchableOpacity
            style={[styles.directionButton, styles.backwardButton]}
            onPressIn={() => sendData("BACKWARD")}
            onPressOut={() => sendData("STOP")}>
            <Text style={styles.directionIcon}>▼</Text>
            <Text style={styles.directionText}>Backward</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={[styles.actionButton, styles.hornButton]} onPress={() => sendData("HORN")}>
          <Text style={styles.actionIcon}>🔊</Text>
          <Text style={styles.actionText}>Horn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.lightButton]} onPress={() => sendData("LIGHT")}>
          <Text style={styles.actionIcon}>💡</Text>
          <Text style={styles.actionText}>Light</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.turboButton]} onPress={() => sendData("TURBO")}>
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#00d4ff",
    fontSize: 16,
    fontWeight: "600",
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
