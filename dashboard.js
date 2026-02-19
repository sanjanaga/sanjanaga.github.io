const socket = io();
let trendsChart, statusChart;
const sensorHistory = {
    temperature: [],
    humidity: [],
    pressure: [],
    carbonMonoxide: [],
    nitrogenDioxide: []
};

const maxDataPoints = 20;

function initializeCharts() {
    const trendsCtx = document.getElementById('trendsChart').getContext('2d');
    trendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'rgb(251, 146, 60)',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Temperature', 'Humidity', 'Pressure', 'Carbon Monoxide', 'Nitrogen Dioxide'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(99, 102, 241, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function updateSensorDisplay(sensorData) {
    for (const [sensor, data] of Object.entries(sensorData)) {
        const valueElement = document.getElementById(`${sensor}-value`);
        const timeElement = document.getElementById(`${sensor}-time`);
        
        if (valueElement) {
            valueElement.textContent = data.value;
        }
        
        if (timeElement) {
            const time = new Date(data.timestamp);
            timeElement.textContent = time.toLocaleTimeString();
        }
    }
}

function updateCharts(sensorData) {
    const currentTime = new Date().toLocaleTimeString();
    
    if (trendsChart.data.labels.length >= maxDataPoints) {
        trendsChart.data.labels.shift();
        trendsChart.data.datasets[0].data.shift();
        trendsChart.data.datasets[1].data.shift();
    }
    
    trendsChart.data.labels.push(currentTime);
    trendsChart.data.datasets[0].data.push(sensorData.temperature.value);
    trendsChart.data.datasets[1].data.push(sensorData.humidity.value);
    trendsChart.update('none');
    
    if (statusChart) {
        statusChart.data.datasets[0].data = [
            sensorData.temperature.value,
            sensorData.humidity.value,
            (sensorData.pressure.value - 1000) * 2,
            sensorData.carbonMonoxide.value * 2,
            sensorData.nitrogenDioxide.value / 5
        ];
        statusChart.update('none');
    }
}

function addActivityLog(sensorData) {
    const activityLog = document.getElementById('activityLog');
    const logEntry = document.createElement('div');
    logEntry.className = 'flex items-center justify-between p-2 bg-gray-50 rounded-lg border-l-4 border-blue-500';
    
    const time = new Date().toLocaleTimeString();
    const alerts = [];
    
    if (sensorData.temperature.value > 30) alerts.push('High temperature');
    if (sensorData.humidity.value < 40) alerts.push('Low humidity');
    if (sensorData.carbonMonoxide.value > 10) alerts.push('High CO levels');
    if (sensorData.nitrogenDioxide.value > 50) alerts.push('High NO2 levels');
    
    logEntry.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-info-circle text-blue-600"></i>
            <span class="text-sm text-gray-700">Sensor data updated</span>
            ${alerts.length > 0 ? `<span class="text-xs text-orange-600 font-semibold">${alerts.join(', ')}</span>` : ''}
        </div>
        <span class="text-xs text-gray-500">${time}</span>
    `;
    
    activityLog.insertBefore(logEntry, activityLog.firstChild);
    
    if (activityLog.children.length > 10) {
        activityLog.removeChild(activityLog.lastChild);
    }
}

function updateTime() {
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        currentTimeElement.textContent = new Date().toLocaleString();
    }
}

socket.on('sensor-data', (sensorData) => {
    updateSensorDisplay(sensorData);
    updateCharts(sensorData);
    addActivityLog(sensorData);
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    const statusIndicator = document.getElementById('statusIndicator');
    if (statusIndicator) {
        statusIndicator.classList.remove('status-online');
        statusIndicator.classList.add('bg-red-500');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    updateTime();
    setInterval(updateTime, 1000);
    
    fetch('/api/sensors')
        .then(response => response.json())
        .then(data => {
            updateSensorDisplay(data);
            updateCharts(data);
        })
        .catch(error => console.error('Error fetching initial data:', error));
});
