/* **************************
 * Weather (Open-Meteo)
 * **************************/
async function getWeather(lat, lon) {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&forecast_days=1`);
        const data = await res.json();
        
        const c = data.current_weather && data.current_weather.temperature;
        
        if (typeof c === 'number') {
            const f = Math.round((c * 9 / 5) + 32);
            document.getElementById('theweather').textContent = `${f}°F`;
        } else {
            document.getElementById('theweather').textContent = 'N/A°F';
        }
    } catch (e) {
        console.error('weather error', e);
        document.getElementById('theweather').textContent = 'N/A°F';
    }
}
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        getWeather(pos.coords.latitude, pos.coords.longitude);
      }, err => {
        console.warn('geo denied or error', err);
        document.getElementById('theweather').textContent = 'N/A°F';
      }, { timeout: 10000 });
    } else {
      document.getElementById('theweather').textContent = 'N/A°F';
    }