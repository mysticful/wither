/* **************************
 * Weather (Open-Meteo)
 * **************************/

const weatherIcons = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌧️", 55: "🌧️",
  56: "🌧️", 57: "🌧️",
  61: "🌦️", 63: "🌧️", 65: "🌧️",
  66: "🌧️", 67: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  77: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "🌧️",
  85: "🌨️", 86: "❄️",
  95: "⛈️", 96: "⛈️", 99: "⛈️"
};

async function getWeather(lat, lon, city) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&forecast_days=1`
    );
    const data = await res.json();
    const weather = data.current_weather;
    const el = document.getElementById("theweather");

    if (weather && typeof weather.temperature === "number") {
      const f = Math.round((weather.temperature * 9) / 5 + 32);
      const icon = weatherIcons[weather.weathercode] || "🌡️";
      el.textContent = `${icon} ${f}°F • ${city || "Unknown"}`;
    } else {
      el.textContent = `🌡️ N/A°F • ${city || "Unknown"}`;
    }
  } catch (e) {
    console.error("weather error", e);
    document.getElementById("theweather").textContent = `🌡️ N/A°F • ${city || "Unknown"}`;
  }
}

async function initWeather() {
  try {
    const ipRes = await fetch("https://ipapi.co/json/");
    const ipData = await ipRes.json();

    if (ipData && ipData.latitude && ipData.longitude) {
      const { latitude, longitude, city } = ipData;
      getWeather(latitude, longitude, city);

      setInterval(() => {
        getWeather(latitude, longitude, city);
      }, 900000);
    } else {
      document.getElementById("theweather").textContent = "🌡️ N/A°F • Unknown";
    }
  } catch (err) {
    console.error("ip lookup error", err);
    document.getElementById("theweather").textContent = "🌡️ N/A°F • Unknown";
  }
}

initWeather();
