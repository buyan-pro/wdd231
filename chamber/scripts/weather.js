// OpenWeatherMap API Configuration
const apiKey = '0b9a766d096a5bfd07d306f691e6717b';
const lat = '47.92'; // Ulaanbaatar Latitude
const lon = '106.92'; // Ulaanbaatar Longitude

const currentUrl = `https://openweathermap.org{lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
const forecastUrl = `https://openweathermap.org{lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

const weatherInfo = document.querySelector('#weather-info');
const forecastInfo = document.querySelector('#forecast-info');

async function apiFetch() {
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (currentResponse.ok && forecastResponse.ok) {
            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            displayCurrentWeather(currentData);
            displayForecast(forecastData);
        } else {
            throw Error('API response failed');
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        if (weatherInfo) {
            weatherInfo.innerHTML = `<p>Weather data currently unavailable.</p>`;
        }
    }
}

function displayCurrentWeather(data) {
    if (!weatherInfo) return;

    const temp = Math.round(data.main.temp);

    if (data.weather && data.weather.length > 0) {
        const desc = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        // FIXED: Restored full OpenWeather image asset directory structure
        const iconUrl = `https://openweathermap.org{iconCode}@2x.png`;

        weatherInfo.innerHTML = `
            <div class="current-weather-display">
                <img src="${iconUrl}" alt="${desc}" width="50" height="50">
                <p class="temp">${temp}&deg;F</p>
                <p class="desc">${capitalizeWords(desc)}</p>
            </div>
        `;
    }
}

function displayForecast(data) {
    if (!forecastInfo) return;
    forecastInfo.innerHTML = '';

    if (data.list) {
        const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

        dailyData.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = Math.round(day.main.temp);

            if (day.weather && day.weather.length > 0) {
                const iconCode = day.weather[0].icon;
                // FIXED: Corrected string template literal parameter wrapper syntax
                const iconUrl = `https://openweathermap.org{iconCode}.png`;
                const desc = day.weather[0].description;

                const dayCard = document.createElement('div');
                dayCard.classList.add('forecast-day');
                dayCard.innerHTML = `
                    <p class="forecast-date">${dayName}</p>
                    <img src="${iconUrl}" alt="${desc}" width="40" height="40">
                    <p class="forecast-temp">${temp}&deg;F</p>
                `;
                forecastInfo.appendChild(dayCard);
            }
        });
    }
}

function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

apiFetch();
