const socket = io();
let mobileTrendsChart;
const mobileSensorHistory = {
    temperature: [],
    humidity: [],
    pressure: [],
    carbonMonoxide: [],
    nitrogenDioxide: []
};

const maxMobileDataPoints = 15;

function initializeMobileCharts() {
    const trendsCtx = document.getElementById('mobileTrendsChart').getContext('2d');
    mobileTrendsChart = new Chart(trendsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: 'rgb(251, 146, 60)',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)',
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function updateMobileSensorDisplay(sensorData) {
    for (const [sensor, data] of Object.entries(sensorData)) {
        const valueElement = document.getElementById(`mobile-${sensor}-value`);
        
        if (valueElement) {
            valueElement.textContent = data.value;
            
            valueElement.parentElement.classList.add('scale-105');
            setTimeout(() => {
                valueElement.parentElement.classList.remove('scale-105');
            }, 200);
        }
    }
}

function updateMobileCharts(sensorData) {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (mobileTrendsChart.data.labels.length >= maxMobileDataPoints) {
        mobileTrendsChart.data.labels.shift();
        mobileTrendsChart.data.datasets[0].data.shift();
        mobileTrendsChart.data.datasets[1].data.shift();
    }
    
    mobileTrendsChart.data.labels.push(currentTime);
    mobileTrendsChart.data.datasets[0].data.push(sensorData.temperature.value);
    mobileTrendsChart.data.datasets[1].data.push(sensorData.humidity.value);
    mobileTrendsChart.update('none');
}

function updateMobileAlerts(sensorData) {
    const alertsContainer = document.getElementById('mobileAlerts');
    const alerts = [];
    
    if (sensorData.temperature.value > 30) {
        alerts.push({
            type: 'warning',
            icon: 'exclamation-triangle',
            message: `High temperature: ${sensorData.temperature.value}°C`,
            color: 'orange'
        });
    }
    
    if (sensorData.temperature.value < 18) {
        alerts.push({
            type: 'warning',
            icon: 'temperature-low',
            message: `Low temperature: ${sensorData.temperature.value}°C`,
            color: 'blue'
        });
    }
    
    if (sensorData.humidity.value < 40) {
        alerts.push({
            type: 'warning',
            icon: 'tint-slash',
            message: `Low humidity: ${sensorData.humidity.value}%`,
            color: 'yellow'
        });
    }
    
    if (sensorData.carbonMonoxide.value > 10) {
        alerts.push({
            type: 'critical',
            icon: 'exclamation-triangle',
            message: `High CO: ${sensorData.carbonMonoxide.value} ppm`,
            color: 'red'
        });
    }
    
    if (sensorData.nitrogenDioxide.value > 50) {
        alerts.push({
            type: 'warning',
            icon: 'wind',
            message: `High NO2: ${sensorData.nitrogenDioxide.value} ppb`,
            color: 'orange'
        });
    }
    
    if (alerts.length === 0) {
        alerts.push({
            type: 'success',
            icon: 'check-circle',
            message: 'All sensors within normal range',
            color: 'green'
        });
    }
    
    alertsContainer.innerHTML = alerts.map(alert => `
        <div class="bg-${alert.color}-50 border-l-4 border-${alert.color}-500 p-3 rounded-lg">
            <div class="flex items-center">
                <i class="fas fa-${alert.icon} text-${alert.color}-600 mr-2"></i>
                <span class="text-sm text-${alert.color}-800">${alert.message}</span>
            </div>
        </div>
    `).join('');
}

function vibrateDevice() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

socket.on('sensor-data', (sensorData) => {
    updateMobileSensorDisplay(sensorData);
    updateMobileCharts(sensorData);
    updateMobileAlerts(sensorData);
    vibrateDevice();
});

socket.on('connect', () => {
    console.log('Mobile connected to server');
    const statusIndicator = document.getElementById('mobileStatusIndicator');
    if (statusIndicator) {
        statusIndicator.classList.add('status-online');
    }
});

socket.on('disconnect', () => {
    console.log('Mobile disconnected from server');
    const statusIndicator = document.getElementById('mobileStatusIndicator');
    if (statusIndicator) {
        statusIndicator.classList.remove('status-online');
        statusIndicator.classList.add('bg-red-500');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializeMobileCharts();
    
    fetch('/api/sensors')
        .then(response => response.json())
        .then(data => {
            updateMobileSensorDisplay(data);
            updateMobileCharts(data);
            updateMobileAlerts(data);
        })
        .catch(error => console.error('Error fetching initial data:', error));
    
    document.querySelectorAll('.mobile-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navButtons.forEach(btn => {
                btn.classList.remove('text-blue-600');
                btn.classList.add('text-gray-500');
            });
            this.classList.remove('text-gray-500');
            this.classList.add('text-blue-600');
        });
    });
});
