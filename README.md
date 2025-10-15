# HC-06 Bluetooth Communication Project

A simple and effective Arduino project for bidirectional communication using the HC-06 Bluetooth module. This project enables wireless data transmission between an Arduino board and any Bluetooth-enabled device (smartphone, tablet, or computer).

## Features

- **Bidirectional Communication**: Send and receive data wirelessly
- **Real-time Data Transfer**: Instant communication with minimal latency
- **Auto-send Capability**: Periodic automatic data transmission
- **Command Recognition**: Responds to specific commands from connected devices
- **Echo Functionality**: Confirms received data by echoing back
- **Serial Monitor Integration**: Debug and test via USB serial connection

## Hardware Requirements

- Arduino board (Uno, Nano, Mega, etc.)
- HC-06 Bluetooth Module
- Jumper wires
- 1-2kΩ resistor (for voltage divider, recommended)
- Breadboard (optional)

## Wiring Diagram

```
HC-06 Module    Arduino Board
-----------     -------------
VCC       -->   5V
GND       -->   GND
TXD       -->   Pin 10 (RX)
RXD       -->   Pin 11 (TX) [through 1-2kΩ resistor]
```

**Note**: HC-06 RX pin operates at 3.3V. Use a voltage divider or resistor to protect it from Arduino's 5V output.

## Software Requirements

- Arduino IDE (1.8.x or higher)
- SoftwareSerial library (included with Arduino IDE)
- Bluetooth terminal app on your mobile device (e.g., Serial Bluetooth Terminal, Bluetooth Terminal HC-05)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/hc06-bluetooth-project.git
   ```

2. Open the `.ino` file in Arduino IDE

3. Connect your Arduino board via USB

4. Select the correct board and port from Tools menu

5. Upload the sketch to your Arduino

## Usage

### Pairing the HC-06 Module

1. Power on your Arduino with the HC-06 connected
2. The HC-06 LED should blink (indicating it's ready to pair)
3. On your phone/device, scan for Bluetooth devices
4. Look for "HC-06" or similar name
5. Pair with default PIN: `1234` or `0000`

### Sending Data from Arduino

The sketch demonstrates three methods:

**1. Manual Send (via Serial Monitor)**

```arduino
// Type in Serial Monitor and press Enter
// Data will be sent to Bluetooth device
```

**2. Automatic Send (Periodic)**

```arduino
// Sends data every 2 seconds automatically
// Useful for sensor readings
```

**3. Programmatic Send**

```arduino
bluetooth.println("Your message here");
```

### Receiving Data on Arduino

Simply send data from your Bluetooth terminal app, and it will appear in the Serial Monitor and trigger a response.

### Supported Commands

- `hello` - Responds with greeting
- `status` - Returns current counter value
- Any other text - Echoes back the message

## Communication Protocol

- **Baud Rate**: 9600
- **Connector Type**: RFCOMM (serial port emulation)
- **Delimiter**: `\n` (newline character)

The delimiter ensures messages are properly separated. When using `bluetooth.println()`, a newline is automatically appended.

## Example Applications

- Remote sensor monitoring
- IoT data logging
- Wireless robot control
- Home automation
- Real-time data visualization
- Arduino-to-smartphone communication

## Customization

You can easily modify the sketch for your needs:

**Send Sensor Data:**

```arduino
int temp = analogRead(A0);
bluetooth.print("Temperature: ");
bluetooth.println(temp);
```

**Change Auto-send Interval:**

```arduino
const long interval = 5000; // Change to 5 seconds
```

**Add Custom Commands:**

```arduino
if (received.indexOf("led_on") >= 0) {
  digitalWrite(LED_PIN, HIGH);
  bluetooth.println("LED turned ON");
}
```

## Troubleshooting

**Can't connect to HC-06:**

- Verify wiring connections
- Check if LED is blinking (pairing mode)
- Try default PINs: 1234 or 0000
- Ensure HC-06 is powered (requires ~50mA)

**No data received:**

- Verify baud rate is 9600 on both sides
- Check TX/RX pins are not swapped
- Ensure delimiter matches (`\n`)

**Garbled data:**

- Check baud rate settings
- Add small delay in data reading loop
- Verify proper voltage levels on RX pin

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Arduino community
- HC-06 Bluetooth module documentation
- SoftwareSerial library developers

## Contact

For questions or suggestions, please open an issue in this repository.

---

**Happy Making! 🚀**
