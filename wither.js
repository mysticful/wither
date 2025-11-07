
/***********************
   * Weather (Open-Meteo)
   ***********************/
  (function () {
    async function getWeather(lat, lon) {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        const c = data?.current_weather?.temperature;
        if (typeof c === 'number') {
          const f = Math.round((c * 9 / 5) + 32);
          document.getElementById('theweather').textContent = `${f}°F`;
        } 
		else {
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

	alert("if this site asks you for your location, you dont have to accept it !! this is only used for obtaining the weather displayed on the main page !!");
})