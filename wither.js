/* **************************
 * Weather (Open-Meteo)
 * **************************/

async function getWeather(lat, lon, city) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&forecast_days=1`
    );
    const data = await res.json();

    const c = data.current_weather && data.current_weather.temperature;

    const el = document.getElementById('theweather');

    if (typeof c === 'number') {
      const f = Math.round((c * 9) / 5 + 32);
      el.textContent = `${f}°F • ${city || 'Unknown'}`;
    } else {
      el.textContent = `N/A°F • ${city || 'Unknown'}`;
    }
  } catch (e) {
    console.error('weather error', e);
    document.getElementById('theweather').textContent = `N/A°F • ${city || 'Unknown'}`;
  }
}

async function initWeather() {
  try {
    const ipRes = await fetch('https://ipapi.co/json/');
    const ipData = await ipRes.json();

    if (ipData && ipData.latitude && ipData.longitude) {
      const { latitude, longitude, city } = ipData;
      getWeather(latitude, longitude, city);
    } else {
      document.getElementById('theweather').textContent = 'N/A°F • Unknown';
    }
  } catch (err) {
    console.error('IP lookup error', err);
    document.getElementById('theweather').textContent = 'N/A°F • Unknown';
  }
}
initWeather();
