/** Multi-city conditions — Open-Meteo, no API key. */
(function () {
    const CITIES = {
        cairo: { lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo', fallback: 'Cairo, Egypt' },
        eureka: { lat: 40.8021, lon: -124.1637, tz: 'America/Los_Angeles', fallback: 'Eureka, CA' },
        seattle: { lat: 47.6062, lon: -122.3321, tz: 'America/Los_Angeles', fallback: 'Seattle, WA' },
        portland: { lat: 45.5152, lon: -122.6784, tz: 'America/Los_Angeles', fallback: 'Portland, OR' },
        'los-angeles': { lat: 34.0522, lon: -118.2437, tz: 'America/Los_Angeles', fallback: 'Los Angeles, CA' },
        lima: { lat: -12.0464, lon: -77.0428, tz: 'America/Lima', fallback: 'Lima, Peru' }
    };

    function wmoLabel(code) {
        const n = Number(code);
        if (n === 0) return 'clear';
        if (n <= 3) return 'partly cloudy';
        if (n <= 48) return 'fog';
        if (n <= 57) return 'drizzle';
        if (n <= 67) return 'rain';
        if (n <= 77) return 'snow';
        if (n <= 82) return 'showers';
        if (n <= 99) return 'storms';
        return 'coast';
    }
    function fmtClock(iso) {
        if (!iso) return '—';
        const time = iso.split('T')[1];
        if (!time) return '—';
        const [hour, minute] = time.split(':').map(Number);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return displayHour + ':' + String(minute).padStart(2, '0') + ' ' + suffix;
    }
    function fmtDay(iso, timezone) {
        return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short', timeZone: timezone
        });
    }
    function loadCityWeather(root, city) {
        const nowEl = root.querySelector('.wx-now');
        const timeEl = root.querySelector('.wx-time');
        const sunEl = root.querySelector('.wx-sun');
        const daysEl = root.querySelector('.wx-days');
        const url = 'https://api.open-meteo.com/v1/forecast'
            + '?latitude=' + city.lat
            + '&longitude=' + city.lon
            + '&current=temperature_2m,weather_code'
            + '&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code'
            + '&timezone=' + encodeURIComponent(city.tz)
            + '&forecast_days=3'
            + '&temperature_unit=fahrenheit';
        fetch(url)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Weather feed returned ' + r.status))))
            .then((data) => {
                const t = Math.round(data.current.temperature_2m);
                nowEl.textContent = t + '°F · ' + wmoLabel(data.current.weather_code);
                timeEl.textContent = 'Local time ' + fmtClock(data.current.time);
                sunEl.textContent = 'Sunrise ' + fmtClock(data.daily.sunrise[0])
                    + ' · Sunset ' + fmtClock(data.daily.sunset[0]);
                daysEl.innerHTML = data.daily.time.map((day, i) => {
                    const hi = Math.round(data.daily.temperature_2m_max[i]);
                    const lo = Math.round(data.daily.temperature_2m_min[i]);
                    return '<div class="wx-day"><strong>' + fmtDay(day, city.tz) + '</strong>'
                        + hi + '° / ' + lo + '° · ' + wmoLabel(data.daily.weather_code[i]) + '</div>';
                }).join('');
            })
            .catch((error) => {
                nowEl.textContent = 'Forecast unavailable';
                timeEl.textContent = 'Local time unavailable';
                sunEl.textContent = city.fallback;
                console.warn('Weather unavailable for ' + city.fallback, error);
            });
    }
    function initWeather() {
        document.querySelectorAll('[data-weather-city]').forEach((root) => {
            const city = CITIES[root.dataset.weatherCity];
            if (city) loadCityWeather(root, city);
        });
    }
    document.addEventListener('DOMContentLoaded', initWeather);
})();
