// chamber/scripts/weather.js
// Robust client-side weather widget (current + 3-day forecast for two cities).
// IMPORTANT: don't hardcode a production API key here; see instructions below.

(function () {
    'use strict';

    // CONFIG: placeholder image and units
    const DEFAULT_PLACEHOLDER = 'images/weather-placeholder.png';
    const UNITS = 'metric';

    // DOM targets (must exist in page)
    const TARGETS = [
        { id: 'ub-weather', q: 'Ulaanbaatar,MN', label: 'Mongolia Head Office' },
        { id: 'hanoi-weather', q: 'Hanoi,VN', label: 'Vietnam Trade Hub' }
    ];
    const FORECAST_CONTAINER_ID = 'forecast-info';

    // Try to obtain API key from safe locations:
    // 1) window.OPENWEATHER_API_KEY (set by your inline <script> before loading this file), OR
    // 2) meta[name="openweather-key"] content, OR
    // 3) data attribute on <body data-openweather-key="...">, OR
    // 4) fallback to placeholder which will show a friendly UI message.
    function readApiKey() {
        if (window.OPENWEATHER_API_KEY && typeof window.OPENWEATHER_API_KEY === 'string' && window.OPENWEATHER_API_KEY.trim()) {
            return window.OPENWEATHER_API_KEY.trim();
        }
        const meta = document.querySelector('meta[name="openweather-key"]');
        if (meta && meta.content) return meta.content.trim();
        if (document.body && document.body.dataset && document.body.dataset.openweatherKey) {
            return document.body.dataset.openweatherKey.trim();
        }
        return null;
    }

    const API_KEY = readApiKey(); // may be null

    // Build URLs
    function buildUrl(base, params) {
        return `${base}?${new URLSearchParams(params).toString()}`;
    }
    function currentUrl(q) {
        return buildUrl('https://api.openweathermap.org/data/2.5/weather', { q, units: UNITS, appid: API_KEY });
    }
    function forecastUrl(q) {
        return buildUrl('https://api.openweathermap.org/data/2.5/forecast', { q, units: UNITS, appid: API_KEY });
    }
    function iconUrl(iconCode) {
        return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : DEFAULT_PLACEHOLDER;
    }

    // Helper: safe fetch with timeout
    async function fetchWithTimeout(url, opts = {}, timeout = 8000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, { ...opts, signal: controller.signal });
            clearTimeout(timer);
            return res;
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    // DOM builders
    function createCurrentCard({ title, name, temp, description, iconCode }) {
        const card = document.createElement('div');
        card.className = 'weather-card card';

        const img = document.createElement('img');
        img.className = 'weather-icon';
        img.src = iconUrl(iconCode);
        img.alt = description ? `${description} icon` : 'Weather icon';
        img.width = 56; img.height = 56; img.loading = 'lazy';
        img.onerror = () => { img.onerror = null; img.src = DEFAULT_PLACEHOLDER; img.alt = 'weather placeholder'; };

        const info = document.createElement('div');
        info.className = 'weather-info';

        const h = document.createElement('div');
        h.className = 'weather-city';
        h.textContent = title || name || '';

        const t = document.createElement('div');
        t.className = 'weather-temp';
        t.textContent = (temp != null) ? `${Math.round(temp)}°C` : '—';

        const d = document.createElement('div');
        d.className = 'weather-desc';
        d.textContent = description || '';

        info.appendChild(h);
        info.appendChild(t);
        info.appendChild(d);

        card.appendChild(img);
        card.appendChild(info);
        return card;
    }

    function createForecastDayNode(day) {
        const node = document.createElement('div');
        node.className = 'forecast-day card';

        const date = document.createElement('div');
        date.className = 'forecast-date';
        date.textContent = day.dateLabel || '';

        const img = document.createElement('img');
        img.className = 'forecast-icon';
        img.src = iconUrl(day.iconCode);
        img.alt = day.description || 'forecast';
        img.width = 48; img.height = 48; img.loading = 'lazy';
        img.onerror = () => { img.onerror = null; img.src = DEFAULT_PLACEHOLDER; img.alt = 'forecast placeholder'; };

        const desc = document.createElement('div');
        desc.className = 'forecast-desc';
        desc.textContent = day.description || '';

        const temps = document.createElement('div');
        temps.className = 'forecast-temps';
        temps.textContent = (day.tempMax != null && day.tempMin != null) ? `${Math.round(day.tempMax)}° / ${Math.round(day.tempMin)}°` : '';

        node.appendChild(date);
        node.appendChild(img);
        node.appendChild(desc);
        node.appendChild(temps);
        return node;
    }

    // Build a 3-day summary: pick the forecast item per day nearest to midday (12:00)
    function extractNextThreeDays(list) {
        if (!Array.isArray(list)) return [];
        const byDate = list.reduce((acc, item) => {
            const d = new Date(item.dt * 1000);
            const key = d.toISOString().slice(0, 10);
            if (!acc[key]) acc[key] = [];
            acc[key].push({ dt: d, item });
            return acc;
        }, {});
        const dates = Object.keys(byDate).sort();
        if (dates.length === 0) return [];

        const today = new Date().toISOString().slice(0, 10);
        const startIndex = (dates[0] === today) ? 1 : 0;
        const chosen = dates.slice(startIndex, startIndex + 3);
        const results = [];

        chosen.forEach(dateKey => {
            const entries = byDate[dateKey];
            if (!entries || entries.length === 0) return;
            const targetHour = 12;
            let best = entries[0];
            let bestDiff = Math.abs(entries[0].dt.getHours() - targetHour);
            for (let i = 1; i < entries.length; i++) {
                const diff = Math.abs(entries[i].dt.getHours() - targetHour);
                if (diff < bestDiff) { best = entries[i]; bestDiff = diff; }
            }
            const itm = best.item;
            results.push({
                dateLabel: new Date(itm.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
                tempMin: itm.main && itm.main.temp_min,
                tempMax: itm.main && itm.main.temp_max,
                description: itm.weather && itm.weather[0] && itm.weather[0].description,
                iconCode: itm.weather && itm.weather[0] && itm.weather[0].icon
            });
        });

        return results;
    }

    // Fetch & render current weather for one target
    async function fetchCurrent(target) {
        const container = document.getElementById(target.id);
        if (!container) return;
        container.innerHTML = '<p>Loading weather…</p>';

        if (!API_KEY) {
            container.innerHTML = `<div class="weather-card error"><img src="${DEFAULT_PLACEHOLDER}" alt="placeholder" width="56" height="56"><div class="weather-info"><div class="weather-city">${target.label}</div><div class="weather-desc">API key not configured</div></div></div>`;
            return;
        }

        try {
            const res = await fetchWithTimeout(currentUrl(target.q));
            if (!res.ok) throw new Error(`API ${res.status}`);
            const data = await res.json();
            const node = createCurrentCard({
                title: target.label,
                name: data.name,
                temp: data.main && data.main.temp,
                description: data.weather && data.weather[0] && data.weather[0].description,
                iconCode: data.weather && data.weather[0] && data.weather[0].icon
            });
            container.innerHTML = '';
            container.appendChild(node);
        } catch (err) {
            console.error('Current fetch error:', err);
            container.innerHTML = `<div class="weather-card error"><img src="${DEFAULT_PLACEHOLDER}" alt="placeholder" width="56" height="56"><div class="weather-info"><div class="weather-city">${target.label}</div><div class="weather-desc">Weather unavailable</div></div></div>`;
        }
    }

    // Fetch the 5-day/3-hour forecast and return a 3-day summary
    async function fetchForecastSummary(q) {
        if (!API_KEY) return null;
        try {
            const res = await fetchWithTimeout(forecastUrl(q));
            if (!res.ok) throw new Error(`Forecast API ${res.status}`);
            const json = await res.json();
            return extractNextThreeDays(Array.isArray(json.list) ? json.list : []);
        } catch (err) {
            console.error('Forecast fetch error for', q, err);
            return null;
        }
    }

    // Render both cities' forecasts
    async function renderForecasts() {
        const fcContainer = document.getElementById(FORECAST_CONTAINER_ID);
        if (!fcContainer) return;
        fcContainer.innerHTML = '<p>Loading 3-day forecast outlook...</p>';

        try {
            const [ubSummary, hnSummary] = await Promise.all([
                fetchForecastSummary('Ulaanbaatar,MN'),
                fetchForecastSummary('Hanoi,VN')
            ]);

            fcContainer.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = 'forecast-wrap';

            function makeCityForecastBlock(label, summary) {
                const block = document.createElement('div');
                block.className = 'forecast-city-block';

                const heading = document.createElement('h4');
                heading.className = 'forecast-city-title';
                heading.textContent = `${label} 3-Day Outlook`;
                block.appendChild(heading);

                const grid = document.createElement('div');
                grid.className = 'forecast-days';
                if (Array.isArray(summary) && summary.length) {
                    summary.forEach(day => grid.appendChild(createForecastDayNode(day)));
                } else {
                    const msg = document.createElement('p');
                    msg.textContent = 'No forecast available.';
                    grid.appendChild(msg);
                }
                block.appendChild(grid);
                return block;
            }

            wrapper.appendChild(makeCityForecastBlock('Ulaanbaatar', ubSummary));
            wrapper.appendChild(makeCityForecastBlock('Hanoi', hnSummary));
            fcContainer.appendChild(wrapper);
        } catch (err) {
            console.error('renderForecasts error:', err);
            fcContainer.innerHTML = '<p>Forecasts unavailable.</p>';
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        // If API key is missing, log guidance without exposing keys in this file
        if (!API_KEY) {
            console.warn('OpenWeather API key not found. Set window.OPENWEATHER_API_KEY or a meta[name="openweather-key"] element, or body data-openweather-key attribute.');
        }

        TARGETS.forEach(t => fetchCurrent(t));
        renderForecasts();
    });

})();