// API Details
const API_KEY = 'e4323e12dff7470b8fa151132260109';
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

// Elements
const locationInput = document.getElementById('locationInput');
const weatherResult = document.getElementById('weatherResult');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

// Enter key se search karo
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Weather data fetch karo
async function getWeather() {
    const location = locationInput.value.trim();
    
    // Check karo ke city name likha hai ya nahi
    if (!location) {
        showError('Kripya city ka naam likho');
        return;
    }

    // Loading dikhao
    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    weatherResult.classList.remove('show');

    try {
        // API ko call karo
        const response = await fetch(
            `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`
        );

        // Check karo response sahi hai ya nahi
        if (!response.ok) {
            throw new Error('City nahi mila. Dubara try karo.');
        }

        // JSON data le lo
        const data = await response.json();
        
        // Weather dikhao
        displayWeather(data);
        loadingDiv.style.display = 'none';

    } catch (error) {
        loadingDiv.style.display = 'none';
        showError(error.message);
    }
}

// Weather ko display karo
function displayWeather(data) {
    const current = data.current;
    const location = data.location;

    // City name
    document.getElementById('locationName').textContent = 
        `${location.name}, ${location.country}`;

    // Temperature
    document.getElementById('temperature').textContent = 
        `${current.temp_c}°C`;

    // Weather condition
    document.getElementById('condition').textContent = 
        current.condition.text;

    // Weather icon emoji
    const icon = getWeatherIcon(current.condition.text);
    document.getElementById('weatherIcon').textContent = icon;

    // Details
    document.getElementById('feelsLike').textContent = 
        `${current.feelslike_c}°C`;
    
    document.getElementById('humidity').textContent = 
        `${current.humidity}%`;
    
    document.getElementById('windSpeed').textContent = 
        `${current.wind_kph} km/h`;
    
    document.getElementById('pressure').textContent = 
        `${current.pressure_mb} mb`;

    // Result dikhao
    weatherResult.classList.add('show');
    errorDiv.style.display = 'none';
}

// Weather ke hisaab se emoji return karo
function getWeatherIcon(condition) {
    const text = condition.toLowerCase();
    
    if (text.includes('clear') || text.includes('sunny')) return '☀️';
    if (text.includes('cloud')) return '☁️';
    if (text.includes('rain')) return '🌧️';
    if (text.includes('snow')) return '❄️';
    if (text.includes('thunder') || text.includes('storm')) return '⛈️';
    if (text.includes('overcast')) return '🌫️';
    
    return '🌤️';
}

// Error message dikhao
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    weatherResult.classList.remove('show');
}
