# IoT Sensor Dashboard

A comprehensive IoT project that displays real-time sensor data on both web and mobile interfaces. Perfect for college projects demonstrating IoT concepts with responsive design.

## Features

### 🌐 Web Dashboard
- **Real-time Sensor Data**: Live updates from 5 different sensors
- **Interactive Charts**: Line charts for trends and doughnut charts for current status
- **Activity Log**: Timestamped sensor updates with alerts
- **Responsive Design**: Works on desktop, tablet, and mobile browsers
- **Live Status Indicators**: Visual feedback for connection status

### 📱 Mobile Interface
- **Touch-Optimized**: Designed specifically for mobile devices
- **Bottom Navigation**: Easy thumb-accessible navigation
- **Vibration Feedback**: Haptic feedback on data updates
- **Alert System**: Color-coded warnings for abnormal readings
- **Compact Layout**: Maximum information in minimal space

### 📊 Sensors Included
1. **Temperature** (°C) - Environmental monitoring
2. **Humidity** (%) - Air moisture levels
3. **Pressure** (hPa) - Atmospheric pressure
4. **Light** (lux) - Ambient light intensity
5. **Soil Moisture** (%) - Agricultural monitoring

## Technology Stack

### Backend
- **Node.js** with Express.js
- **Socket.IO** for real-time communication
- **Sensor Data Simulation** (easily replaceable with real sensors)

### Frontend
- **HTML5** with semantic markup
- **Tailwind CSS** for responsive styling
- **Chart.js** for data visualization
- **Font Awesome** for icons
- **Vanilla JavaScript** (no frameworks required)

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the dashboards**:
   - **Web Dashboard**: http://localhost:3000
   - **Mobile View**: http://localhost:3000/mobile

## Project Structure

```
iot-sensor-dashboard/
├── server.js              # Main server file with sensor simulation
├── package.json           # Dependencies and scripts
├── public/
│   ├── index.html         # Web dashboard
│   ├── mobile.html        # Mobile-optimized interface
│   ├── dashboard.js       # Web dashboard JavaScript
│   └── mobile.js          # Mobile interface JavaScript
└── README.md              # This file
```

## How It Works

### Data Flow
1. **Sensor Simulation**: Server generates realistic sensor data every 2 seconds
2. **Real-time Updates**: Socket.IO pushes data to connected clients
3. **Visual Updates**: Frontend displays data with smooth animations
4. **Alert System**: Automatic alerts for abnormal readings

### API Endpoints

- `GET /api/sensors` - Get all sensor data
- `GET /api/sensors/:type` - Get specific sensor data
- `Socket.IO Events` - Real-time data streaming

### Socket.IO Events
- `sensor-data` - Broadcasted sensor data (every 2 seconds)
- `connect` - Client connection established
- `disconnect` - Client disconnected

## Customization

### Adding Real Sensors
Replace the `SensorDataSimulator` class in `server.js` with actual sensor readings:

```javascript
// Example with real sensor integration
const sensorData = await readFromRealSensors();
io.emit('sensor-data', sensorData);
```

### Adding New Sensors
1. Update the `sensors` object in `SensorDataSimulator`
2. Add HTML elements in both `index.html` and `mobile.html`
3. Update JavaScript files to handle the new sensor
4. Modify charts to include the new data

### Styling Customization
- Modify Tailwind classes in HTML files
- Update color schemes in CSS variables
- Adjust chart colors in JavaScript files

## Browser Support

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Tablets**: iPadOS, Android tablets

## Performance Features

- **Efficient Updates**: Only changed data is transmitted
- **Chart Optimization**: Limited data points for smooth performance
- **Responsive Images**: Optimized for different screen sizes
- **Minimal Dependencies**: Fast loading times

## Educational Value

This project demonstrates:
- **IoT Concepts**: Sensor data collection and visualization
- **Real-time Communication**: WebSocket implementation
- **Responsive Design**: Mobile-first development
- **Data Visualization**: Chart integration
- **Backend Development**: REST APIs and real-time events
- **Frontend Development**: Modern JavaScript and CSS

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT in server.js or kill existing process
2. **Socket connection issues**: Check firewall settings
3. **Charts not displaying**: Ensure Chart.js CDN is accessible
4. **Mobile responsiveness**: Test with browser developer tools

### Development Tips

- Use browser developer tools to test mobile views
- Check console for Socket.IO connection status
- Monitor network tab for API calls
- Test with different screen sizes

## Future Enhancements

- [ ] Database integration for historical data
- [ ] User authentication and authorization
- [ ] MQTT protocol support for real IoT devices
- [ ] Push notifications for mobile alerts
- [ ] Data export functionality
- [ ] Multi-device support
- [ ] Custom alert thresholds
- [ ] Dark mode support

## License

MIT License - Free for educational and commercial use

---

**Perfect for college IoT projects!** 🎓

This project provides a solid foundation for understanding IoT concepts, real-time data communication, and responsive web development. The modular design makes it easy to extend and customize for specific project requirements.
