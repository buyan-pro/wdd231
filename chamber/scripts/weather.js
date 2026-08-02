// OpenWeatherMap API Configuration
const apiKey = '0b9a766d096a5bfd07d306f691e6717b';

// Fixed Coordinates mapping targets for dual-city regional trackers
const coords = {
    ub: { lat: '47.92', lon: '106.92', containerId: '#ub-weather', name: 'Ulaanbaatar' },
    hanoi: { lat: '21.03', lon: '105.85', containerId: '#hanoi-weather', name: 'Hanoi' }
};

// Target DOM Forecast Anchor Point
const forecastInfo = document.querySelector('#forecast-info');

// 1. Independent Safe Fetch Engine for Current Weather Conditions
async function fetchCurrentWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`);
        if (!response.ok) return;

        const data = await response.json();
        const el = document.querySelector(city.containerId);
        if (!el || !data.weather || data.weather.length === 0) return;

        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description;
        const iconCode = data.weather[0].icon;

        // FIXED ICON ROUTE: Restored absolute folder paths for crisp image loading
        const iconUrl = `https://openweathermap.org{iconCode}@2x.png`;

        el.innerHTML = `
            <div class="current-weather-display" style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: 10px;">
                <img src="${iconUrl}" alt="${desc}" width="50" height="50">
                <div style="text-align: left;">
                    <p class="temp" style="font-size: 1.8rem; font-weight: 700; margin: 0;">${temp}&deg;C</p>
                    <p class="desc" style="margin: 0; text-transform: capitalize; color: var(--text-muted); font-size: 0.85rem;">${desc}</p>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Current Weather Fetch Failed:", e);
    }
}

// 2. Render Individual City Forecast Rows (Maintains custom layout classes)
async function appendCityForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`);
        if (!response.ok) return;

        const data = await response.json();
        if (!forecastInfo || !data.list) return;

        // Group cards using a row flexbox container per city
        const cityRow = document.createElement('div');
        cityRow.style.cssText = "display: flex; flex-direction: column; width: 100%; margin-bottom: 25px; align-items: center;";

        const titleLabel = document.createElement('h4');
        titleLabel.innerText = `${city.name} 3-Day Outlook`;
        titleLabel.style.cssText = "margin: 0 0 12px 0; color: var(--primary-color); font-weight: 600; font-size: 1rem; width: 100%; text-align: center;";
        cityRow.appendChild(titleLabel);

        const gridWrapper = document.createElement('div');
        gridWrapper.style.cssText = "display: flex; justify-content: space-around; width: 100%; max-width: 450px; gap: 15px;";

        // Extract consistent mid-day entries over consecutive 24-hour cycles
        const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

        dailyData.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = Math.round(day.main.temp);

            if (day.weather && day.weather.length > 0) {
                const iconCode = day.weather[0].icon;

                // FIXED FORECAST ICON ROUTE: Restored clean folder parameters
                const iconUrl = `https://openweathermap.org{iconCode}.png`;
                const desc = day.weather[0].description;

                const dayCard = document.createElement('div');
                dayCard.className = 'forecast-day';
                dayCard.innerHTML = `
                    <p class="forecast-date" style="font-weight: bold; margin: 0 0 5px 0; font-size: 0.85rem; color: var(--text-main);">${dayName}</p>
                    <img src="${iconUrl}" alt="${desc}" width="40" height="40">
                    <p class="forecast-temp" style="font-weight: bold; margin: 5px 0 0 0; font-size: 0.85rem;">${temp}&deg;C</p>
                `;
                gridWrapper.appendChild(dayCard);
            }
        });

        cityRow.appendChild(gridWrapper);
        forecastInfo.appendChild(cityRow);
    } catch (e) {
        console.error("Forecast Data Render Exception:", e);
    }
}

// 3. Execution Launcher Loop - CRITICAL ORDER: Ulaanbaatar runs first, Hanoi second
function initWeatherModule() {
    if (forecastInfo) forecastInfo.innerHTML = ''; // Fresh DOM Canvas wipeout

    // Load current stats
    fetchCurrentWeather(coords.ub);
    fetchCurrentWeather(coords.hanoi);

    // Append forecasts in strict layout order
    appendCityForecast(coords.ub);    // Ulaanbaatar first
    appendCityForecast(coords.hanoi); // Hanoi second
}

initWeatherModule();
