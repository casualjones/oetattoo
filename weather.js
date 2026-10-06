/** Eureka, CA coast conditions — Open-Meteo, no API key. */
(function () {
    const EUREKA = { lat: 40.8021, lon: -124.1637, tz: 'America/Los_Angeles' };

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
        return new Date(iso).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', timeZone: EUREKA.tz
        });
    }
    function fmtDay(iso) {
        return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short', timeZone: EUREKA.tz
        });
    }
    function initEurekaWx() {
        const root = document.getElementById('eureka-wx');
        if (!root) return;
        const nowEl = document.getElementById('wx-now');
        const sunEl = document.getElementById('wx-sun');
        const daysEl = document.getElementById('wx-days');
        const url = 'https://api.open-meteo.com/v1/forecast'
            + '?latitude=' + EUREKA.lat
            + '&longitude=' + EUREKA.lon
            + '&current=temperature_2m,weather_code'
            + '&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code'
            + '&timezone=' + encodeURIComponent(EUREKA.tz)
            + '&forecast_days=3'
            + '&temperature_unit=fahrenheit';
        fetch(url)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data) => {
                const t = Math.round(data.current.temperature_2m);
                nowEl.textContent = t + '°F · ' + wmoLabel(data.current.weather_code);
                sunEl.textContent = 'Sunrise ' + fmtClock(data.daily.sunrise[0]) + ' · Sunset ' + fmtClock(data.daily.sunset[0]);
                daysEl.innerHTML = data.daily.time.map((day, i) => {
                    const hi = Math.round(data.daily.temperature_2m_max[i]);
                    const lo = Math.round(data.daily.temperature_2m_min[i]);
                    return '<div class="wx-day"><strong>' + fmtDay(day) + '</strong>'
                        + hi + '° / ' + lo + '° · ' + wmoLabel(data.daily.weather_code[i]) + '</div>';
                }).join('');
            })
            .catch(() => {
                nowEl.textContent = 'Coast feed offline';
                sunEl.textContent = 'Eureka, CA';
            });
    }
    document.addEventListener('DOMContentLoaded', initEurekaWx);
})();
