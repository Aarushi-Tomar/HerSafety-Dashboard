const map = L.map('map').setView([28.6, 77.2], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
let incidentMarkers = [];


let incidents = [
    { city: 'Delhi', type: 'Harassment', lat: 28.7041, lng: 77.1025, year: 2022 },
    { city: 'Mumbai', type: 'Assault', lat: 19.0760, lng: 72.8777, year: 2023 },
    { city: 'Bangalore', type: 'Theft', lat: 12.9716, lng: 77.5946, year: 2021 },
    { city: 'Chennai', type: 'Other', lat: 13.0827, lng: 80.2707, year: 2022 },
    { city: 'Kolkata', type: 'Harassment', lat: 22.5726, lng: 88.3639, year: 2023 },
    { city: 'Delhi', type: 'Assault', lat: 28.6139, lng: 77.2090, year: 2021 },
    { city: 'Mumbai', type: 'Theft', lat: 18.9750, lng: 72.8258, year: 2022 },
    { city: 'Bangalore', type: 'Harassment', lat: 12.9165, lng: 77.6010, year: 2023 },
    { city: 'Chennai', type: 'Assault', lat: 13.0674, lng: 80.2376, year: 2021 },
    { city: 'Kolkata', type: 'Other', lat: 22.5667, lng: 88.3700, year: 2022 }
];
let crimeStatisticsChart, safetyIndexChart, crimeTimeChart;
let crimeTypes = ['Harassment', 'Assault', 'Theft', 'Other'];

function generateUniqueColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const hue = (i * 137.508) % 360; // Use golden angle approximation for even distribution
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}
let cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];


let crimeStatisticsData = {
    labels: ['Harassment', 'Assault', 'Theft', 'Other'],
    datasets: [{
        data: [45, 30, 25, 10],
        backgroundColor: generateUniqueColors(4)
    }]
};

let safetyIndexData = {
    labels: cities,
    datasets: [{
        label: 'Safety Index',
        data: [60, 75, 80, 85, 90],
        backgroundColor: generateUniqueColors(5)
    }]
};

let crimeTimeData = {
    labels: ['Day', 'Night'],
    datasets: [{
        label: 'Crime by Time of Day',
        data: [70, 30],
        backgroundColor: generateUniqueColors(2)
    }]
};


function randomIncident() {
    return {
        city: cities[Math.floor(Math.random() * cities.length)],
        type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
        lat: 20 + Math.random() * 10,
        lng: 75 + Math.random() * 10,
        year: 2020 + Math.floor(Math.random() * 5)
    };
}

function updateMap() {
    incidentMarkers.forEach(m => map.removeLayer(m));
    incidentMarkers = [];
    incidents.forEach(inc => {
        let marker = L.marker([inc.lat, inc.lng]).addTo(map)
            .bindPopup(`<b>${inc.type}</b><br>${inc.city} (${inc.year})`);
        incidentMarkers.push(marker);
    });
}

function updateCrimeStatisticsChart() {
    console.log('Updating Crime Statistics Chart');
    const ctx = document.getElementById('crimeStatisticsChart');
    if (!ctx) {
        console.error('Canvas element for crimeStatisticsChart not found!');
        return;
    }
    if (crimeStatisticsChart) crimeStatisticsChart.destroy();
    crimeStatisticsChart = new Chart(ctx, {
        type: 'doughnut',
        data: crimeStatisticsData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateSafetyIndexChart() {
    console.log('Updating Safety Index Chart');
    const ctx = document.getElementById('safetyIndexChart');
    if (!ctx) {
        console.error('Canvas element for safetyIndexChart not found!');
        return;
    }
    if (safetyIndexChart) safetyIndexChart.destroy();
    safetyIndexChart = new Chart(ctx, {
        type: 'bar',
        data: safetyIndexData,
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateCrimeTimeChart() {
    console.log('Updating Crime Time Chart');
    const ctx = document.getElementById('crimeTimeChart');
    if (!ctx) {
        console.error('Canvas element for crimeTimeChart not found!');
        return;
    }
    if (crimeTimeChart) crimeTimeChart.destroy();
    crimeTimeChart = new Chart(ctx, {
        type: 'line',
        data: crimeTimeData,
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function refreshDashboard() {
    console.log('Refreshing Dashboard...');
    updateMap();
    updateCrimeStatisticsChart();
    updateSafetyIndexChart();
    updateCrimeTimeChart();
}

document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < 30; i++) incidents.push(randomIncident());
    refreshDashboard();
});