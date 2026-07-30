// OpenWeatherMap API Configuration Matrix
const apiKey = '0b9a766d096a5bfd07d306f691e6717b';

// Fixed Coordinates mapping targets for dual-city regional trackers
const coords = {
    ub: { lat: '47.92', lon: '106.92', containerId: '#ub-weather' },
    hanoi: { lat: '21.03', lon: '105.85', containerId: '#hanoi-weather' }
};

// Target DOM Forecast Anchor Point
const forecastInfo = document.querySelector('#forecast-info');

async function fetchChamberWeather() {
    try {
        // Fetch Current Conditions for both regional corporate hubs concurrently
        const [ubRes, hanoiRes, forecastRes] = await Promise.all([
            fetch(`https://openweathermap.org{coords.ub.lat}&lon=${coords.ub.lon}&units=imperial&appid=${apiKey}`),
            fetch(`https://openweathermap.org{coords.hanoi.lat}&lon=${coords.hanoi.lon}&units=imperial&appid=${apiKey}`),
            fetch(`https://openweathermap.org{coords.ub.lat}&lon=${coords.ub.lon}&units=imperial&appid=${apiKey}`)
        ]);

        if (ubRes.ok && hanoiRes.ok && forecastRes.ok) {
            displayCurrentCity(await ubRes.json(), coords.ub.containerId);
            displayCurrentCity(await hanoiRes.json(), coords.hanoi.containerId);
            displayForecast(await forecastRes.json());
        } else {
            throw Error('OpenWeather data channel connection rejected.');
        }
    } catch (error) {
        console.error("Critical Weather Module Engine Exception:", error);
    }
}

function displayCurrentCity(data, containerId) {
    const el = document.querySelector(containerId);
    if (!el) return;

    const temp = Math.round(data.main.temp);

    // CORRECTION FIXED: Accessing index [0] to parse array data parameters securely
    if (data.weather && data.weather.length > 0) {
        const desc = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org{iconCode}@2x.png`;

        el.innerHTML = `
            <div class="current-weather-display" style="display: flex; align-items: center; gap: 15px;">
                <img src="${iconUrl}" alt="${desc}" width="50" height="50">
                <div>
                    <p class="temp" style="font-size: 1.8rem; font-weight: 700; margin: 0;">${temp}&deg;F</p>
                    <p class="desc" style="margin: 0; text-transform: capitalize; color: var(--text-muted); font-size: 0.85rem;">${desc}</p>
                </div>
            </div>
        `;
    }
}

function displayForecast(data) {
    if (!forecastInfo) return;
    forecastInfo.innerHTML = '';

    if (data.list) {
        // Extract consecutive noon updates over the next three days
        const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

        dailyData.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = Math.round(day.main.temp);

            // CORRECTION FIXED: Target object zero inside weather array loops
            if (day.weather && day.weather.length > 0) {
                const iconCode = day.weather[0].icon;
                const iconUrl = `https://openweathermap.org{iconCode}.png`;
                const desc = day.weather[0].description;

                const dayCard = document.createElement('div');
                dayCard.className = 'forecast-day';
                dayCard.innerHTML = `
                    <p class="forecast-date" style="font-weight: bold; margin: 0 0 5px 0;">${dayName}</p>
                    <img src="${iconUrl}" alt="${desc}" width="40" height="40">
                    <p class="forecast-temp" style="font-weight: bold; margin: 5px 0 0 0;">${temp}&deg;F</p>
                `;
                forecastInfo.appendChild(dayCard);
            }
        });
    }
}

fetchChamberWeather();
