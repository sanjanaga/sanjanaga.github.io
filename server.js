const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

class SensorDataSimulator {
  constructor() {
    this.sensors = {
      temperature: { value: 25, unit: '°C', min: 15, max: 35 },
      humidity: { value: 60, unit: '%', min: 30, max: 80 },
      pressure: { value: 1013, unit: 'hPa', min: 1000, max: 1030 },
      carbonMonoxide: { value: 5, unit: 'ppm', min: 0, max: 50 },
      nitrogenDioxide: { value: 10, unit: 'ppb', min: 0, max: 100 }
    };
  }

  generateRandomValue(sensor) {
    const config = this.sensors[sensor];
    const change = (Math.random() - 0.5) * 2;
    let newValue = config.value + change;
    
    if (newValue < config.min) newValue = config.min;
    if (newValue > config.max) newValue = config.max;
    
    config.value = Math.round(newValue * 10) / 10;
    return config.value;
  }

  getAllSensorData() {
    const data = {};
    for (const sensor in this.sensors) {
      this.generateRandomValue(sensor);
      data[sensor] = {
        value: this.sensors[sensor].value,
        unit: this.sensors[sensor].unit,
        timestamp: new Date().toISOString()
      };
    }
    return data;
  }
}

const sensorSimulator = new SensorDataSimulator();

app.get('/api/sensors', (req, res) => {
  res.json(sensorSimulator.getAllSensorData());
});

app.get('/api/sensors/:type', (req, res) => {
  const sensorType = req.params.type;
  if (sensorSimulator.sensors[sensorType]) {
    sensorSimulator.generateRandomValue(sensorType);
    const data = {
      value: sensorSimulator.sensors[sensorType].value,
      unit: sensorSimulator.sensors[sensorType].unit,
      timestamp: new Date().toISOString()
    };
    res.json(data);
  } else {
    res.status(404).json({ error: 'Sensor not found' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.emit('sensor-data', sensorSimulator.getAllSensorData());
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

setInterval(() => {
  const sensorData = sensorSimulator.getAllSensorData();
  io.emit('sensor-data', sensorData);
}, 2000);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

server.listen(PORT, () => {
  console.log(`IoT Sensor Dashboard running on http://localhost:${PORT}`);
  console.log(`Mobile view: http://localhost:${PORT}/mobile`);
});
