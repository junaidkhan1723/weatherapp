
// API configuration
const API_KEY = 'a7be8aa56496405da20135347252205'; // Replace with your actual API key
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// DOM Element Selection
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const cityNameDisplay = document.getElementById('city-name');
const countryNameDisplay = document.getElementById('country-name');
const temperatureValue = document.getElementById('temperature-value');
const weatherDescription = document.getElementById('weather-description');
const iconContainer = document.getElementById('icon-container');
const windSpeedDisplay = document.getElementById('wind-speed');
const humidityValue = document.getElementById('humidity-value');
const messageArea = document.getElementById('message-area');
const weatherDisplay = document.querySelector('.weather-display');
const rainContainer = document.getElementById('rain-container');
const cloudContainer = document.getElementById('cloud-container');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchWeatherData('Nanded'); // Default city on load
});

searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  } else {
    displayMessage('Please enter a city name.', 'error');
  }
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchButton.click(); // Simulate button click
  }
});

// Functions
async function fetchWeatherData(city) {
  displayMessage('Loading...', 'info');
  weatherDisplay.style.display = 'none';

  const url = `${BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        displayMessage('City not found. Please try again.', 'error');
      } else {
        displayMessage(`Error: ${response.status} ${response.statusText}`, 'error');
      }
      return;
    }

    const data = await response.json();
    console.log(data); // For debugging

    // Process data and update UI
    displayWeatherData(data);
    clearMessage();
    weatherDisplay.style.display = 'grid';
  } catch (error) {
    console.error('Network error:', error);
    displayMessage('Failed to connect to the weather service. Please check your internet connection.', 'error');
  }
}

function displayWeatherData(data) {
  const { location, current } = data;

  cityNameDisplay.textContent = location.name;
  countryNameDisplay.textContent = location.country;
  temperatureValue.textContent = Math.round(current.temp_c);
  weatherDescription.textContent = current.condition.text;
  windSpeedDisplay.textContent = current.wind_kph;
  humidityValue.textContent = current.humidity;

  // Add wind animation to wind speed
  windSpeedDisplay.innerHTML = `<span class="wind-indicator">${current.wind_kph}</span>`;

  // Update weather icon and animations
  updateWeatherIconAndAnimations(current.condition.code, current.condition.text);
}

function updateWeatherIconAndAnimations(conditionCode, conditionText) {
  // Clear previous animations and icons
  clearDynamicAnimations();
  iconContainer.innerHTML = '';

  // Simplified condition mapping based on condition text
  const condition = conditionText.toLowerCase();
  
  // Create icon SVG based on condition
  let svgIcon;
  
  if (condition.includes('sunny') || condition.includes('clear')) {
    svgIcon = createSunIcon();
    // No background animations for sunny
  } 
  else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    svgIcon = createRainIcon();
    createRaindrops(); // Add rain animation
  }
  else if (condition.includes('cloud') || condition.includes('overcast')) {
    svgIcon = createCloudIcon();
    createClouds(); // Add cloud animation
  }
  else {
    // Default to cloud icon for other conditions
    svgIcon = createCloudIcon();
  }
  
  iconContainer.appendChild(svgIcon);
}

function createSunIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('sun-icon');
  
  // Circle for sun
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '50');
  circle.setAttribute('cy', '50');
  circle.setAttribute('r', '25');
  circle.setAttribute('fill', '#ffcc33');
  
  // Rays
  for (let i = 0; i < 8; i++) {
    const ray = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const angle = (i * 45) * Math.PI / 180;
    const x1 = 50 + 30 * Math.cos(angle);
    const y1 = 50 + 30 * Math.sin(angle);
    const x2 = 50 + 40 * Math.cos(angle);
    const y2 = 50 + 40 * Math.sin(angle);
    
    ray.setAttribute('x1', x1);
    ray.setAttribute('y1', y1);
    ray.setAttribute('x2', x2);
    ray.setAttribute('y2', y2);
    ray.setAttribute('stroke', '#ffcc33');
    ray.setAttribute('stroke-width', '5');
    ray.setAttribute('stroke-linecap', 'round');
    
    svg.appendChild(ray);
  }
  
  svg.appendChild(circle);
  return svg;
}

function createCloudIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('cloud-icon');
  
  // Main cloud
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M25,60 Q10,60 10,50 Q10,40 20,40 Q20,25 35,25 Q50,25 55,40 Q65,40 70,50 Q80,50 80,60 Z');
  path.setAttribute('fill', '#cccccc');
  
  svg.appendChild(path);
  return svg;
}

function createRainIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('rain-icon');
  
  // Cloud
  const cloud = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  cloud.setAttribute('d', 'M25,40 Q10,40 10,30 Q10,20 20,20 Q20,5 35,5 Q50,5 55,20 Q65,20 70,30 Q80,30 80,40 Z');
  cloud.setAttribute('fill', '#cccccc');
  
  // Raindrops
  const positions = [[30, 50], [45, 55], [60, 50], [70, 60]];
  positions.forEach(([x, y]) => {
    const drop = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    drop.setAttribute('d', `M${x},${y} Q${x+5},${y+15} ${x},${y+20} Q${x-5},${y+15} ${x},${y}`);
    drop.setAttribute('fill', '#66a3ff');
    svg.appendChild(drop);
  });
  
  svg.appendChild(cloud);
  return svg;
}

function createRaindrops() {
  rainContainer.innerHTML = '';
  
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement('div');
    drop.classList.add('raindrop');
    
    // Randomize position and animation properties
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    
    rainContainer.appendChild(drop);
  }
}

function createClouds() {
  cloudContainer.innerHTML = '';
  
  // Create 3-5 clouds with different sizes and speeds
  const numClouds = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numClouds; i++) {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    
    // Randomize cloud properties
    const size = 40 + Math.random() * 60; // Size between 40px-100px
    const top = Math.random() * 80; // Position from top 0-80%
    const opacity = 0.2 + Math.random() * 0.3; // Opacity between 0.2-0.5
    const duration = 15 + Math.random() * 20; // Animation duration between 15-35s
    const delay = -Math.random() * 15; // Negative delay for initial positions
    
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size * 0.6}px`;
    cloud.style.top = `${top}%`;
    cloud.style.opacity = opacity;
    cloud.style.animationDuration = `${duration}s`;
    cloud.style.animationDelay = `${delay}s`;
    
    // Add some variance to cloud shape with box-shadow
    cloud.style.boxShadow = `
      ${Math.random() * 20 - 10}px ${Math.random() * 10}px 15px rgba(255, 255, 255, ${opacity})
    `;
    
    cloudContainer.appendChild(cloud);
  }
}

function clearDynamicAnimations() {
  rainContainer.innerHTML = '';
  cloudContainer.innerHTML = '';
}

function displayMessage(message, type) {
  messageArea.textContent = message;
  messageArea.className = 'message-area'; // Reset class
  messageArea.classList.add(type); // Add type class (info or error)
}

function clearMessage() {
  messageArea.textContent = '';
  messageArea.className = 'message-area'; // Hide message area
}

export.default = series(scssTask,jsTask,browserSyncServer,watchTask);

exports.build = series(scssTask , jsTask);
