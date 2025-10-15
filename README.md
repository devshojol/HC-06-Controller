# 🚗 HC-06 Bluetooth Car Controller With React Native

A React Native mobile application for controlling Arduino-based RC cars via HC-06 Bluetooth module. Features an intuitive car remote control interface with real-time command sending and response handling.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.72+-61DAFB.svg)
![Arduino](https://img.shields.io/badge/Arduino-Compatible-00979D.svg)

## ✨ Features

- 🔍 **Device Scanning** - Automatically scan and list paired Bluetooth devices
- 🎮 **Car Remote Interface** - Intuitive directional controls (Forward, Backward, Left, Right)
- ⚡ **Speed Control** - Adjustable speed from 0-100% with preset options
- 🔊 **Action Buttons** - Horn, Light toggle, and Turbo mode
- 🔄 **Real-time Communication** - Send and receive data from Arduino in real-time
- 🎨 **Modern UI** - Clean, colorful, and responsive interface

### Device List Screen

- Scan for paired HC-06 devices
- Connect with a single tap

### Controller Screen

- Directional controls with visual feedback
- Speed adjustment slider
- Quick action buttons

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **react-native-bluetooth-classic** - Bluetooth communication

## 📋 Prerequisites

- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Arduino IDE
- HC-06 Bluetooth Module

## 🚀 Installation

### Mobile App Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/devshojol/HC-06-Controller.git
   cd HC-06-Controller
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**

   ```bash
   # Android
   npx expo run:android --device

   # iOS
   npx expo run:ios --device
   ```

### Arduino Setup

1. **Install Arduino IDE** from [arduino.cc](https://www.arduino.cc/en/software)

2. **Install SoftwareSerial Library** (usually pre-installed)

<!-- 3. **Upload the sketch**

   - Open `arduino/hc06_car_controller.ino`
   - Select your Arduino board and port
   - Click Upload

4. **Wiring Diagram**

   ```
   HC-06 Module:
   - VCC → 5V
   - GND → GND
   - TX  → Arduino Pin 0
   - RX  → Arduino Pin 1 (use voltage divider 5V→3.3V)

   Motor Driver (L298N or similar):
   - IN1 → Pin 2 (Left Motor Forward)
   - IN2 → Pin 3 (Left Motor Backward)
   - IN3 → Pin 4 (Right Motor Forward)
   - IN4 → Pin 5 (Right Motor Backward)
   - ENA → Pin 6 (Speed Control - PWM)

   Other Components:
   - LED → Pin 13
   - Horn/Buzzer → Pin 8
   - Lights → Pin 9
   ``` -->

## 🎮 Usage

### App Commands

**Movement Controls:**

- `FORWARD` - Move forward
- `BACKWARD` - Move backward
- `LEFT` - Turn left
- `RIGHT` - Turn right
- `STOP` - Stop all motors

**Speed Control:**

- `SPEED:XX` - Set speed (0-100%)

**Action Buttons:**

- `HORN` - Activate horn
- `LIGHT` - Toggle lights
- `TURBO` - Activate turbo mode (3 seconds max speed)

## 📂 Project Structure

```
hc06-car-controller/
├── App.js                          # Main app component
├── components/
│   └── BluetoothCarController.js   # Car controller component
├── arduino/
│   └── hc06_car_controller.ino     # Arduino sketch
├── android/                        # Android native files
├── ios/                            # iOS native files
├── package.json
├── README.md
└── LICENSE
```

<!--
## 🔧 Configuration

### Adjust Pin Numbers

In the Arduino sketch, modify these pin definitions based on your setup:

```cpp
#define MOTOR_LEFT_FWD 2
#define MOTOR_LEFT_BWD 3
#define MOTOR_RIGHT_FWD 4
#define MOTOR_RIGHT_BWD 5
#define MOTOR_SPEED_PIN 6
#define LED_PIN 13
#define HORN_PIN 8
#define LIGHT_PIN 9
```

### Bluetooth Settings

HC-06 default settings:

- **Baud Rate:** 9600
- **Device Name:** HC-06
- **PIN:** 1234 or 0000

To change settings, use AT commands before connecting.

## 🐛 Troubleshooting

### App Issues

**Bluetooth not working:**

- Ensure Bluetooth is enabled on your phone
- Grant all required permissions
- Check if HC-06 is powered and paired

**Cannot connect to device:**

- Make sure HC-06 is not connected to another device
- Try unpairing and pairing again
- Restart the app

### Arduino Issues

**Motors not responding:**

- Check motor driver connections
- Verify power supply is adequate
- Test motors separately

**No Bluetooth communication:**

- Check HC-06 wiring (especially RX/TX)
- Verify baud rate matches (9600)
- Check voltage divider for RX pin -->

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**SHOJOL ISLAM**

- GitHub: [@devshojol](https://github.com/devshojol)

## 🙏 Acknowledgments

- [react-native-bluetooth-classic](https://github.com/kenjdavidson/react-native-bluetooth-classic)
- Arduino Community
- React Native Community

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

⭐ **Star this repo** if you find it helpful!

---
