function getWeatherData() {
  const weatherDataObj = new Object(); // Main Object
  const weekWeatherData = new Object();
  let latitude, longitude; // user
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
      const API_KEY = "3221ba97b0332bd1865ae65794a5c077";
      const API_LINK = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,hourly,minutely,alerts&units=metric&appid=`;

      fetch(API_LINK + API_KEY)
        .then((response) => response.json())
        .then((weatherData) => {
          const todayDate = new Date(
            weatherData.daily[0].dt * 1000
          ).toLocaleDateString("en");

          weatherDataObj.todayTemp = todayTemperature =
            weatherData.daily[0].temp.day.toFixed(0);
          weatherDataObj.todayWindSpeed =
            weatherData.daily[0].wind_speed + " mph";
          weatherDataObj.todayHumidity = weatherData.daily[0].humidity;

          weatherData.daily.forEach((eachDay, index) => {
            if (index > 0) {
              const dayName = new Date(eachDay.dt * 1000).toLocaleDateString(
                "en",
                {
                  weekday: "short",
                }
              );
              const temperature = eachDay.temp.day.toFixed(0);
              weekWeatherData[dayName] = temperature;
            }
          });
        })
        .catch((error) => console.log("Fetch Error: " + error));
    });
  }

  weatherDataObj.weekWeatherData = weekWeatherData;
  return weatherDataObj; // returns all the weather information needed
}

document.addEventListener("DOMContentLoaded", () => getWeatherData());
