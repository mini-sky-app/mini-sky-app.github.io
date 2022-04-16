const API_KEY = "3221ba97b0332bd1865ae65794a5c077";
const API_LINK =
  "https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=current,hourly,minutely,alerts&units=metric&appid=";

document.addEventListener("DOMContentLoaded", () => {
  fetch(API_LINK + API_KEY)
    .then((response) => response.json())
    .then((weatherData) => {
      const todayDate = new Date(
        weatherData.daily[0].dt * 1000
      ).toLocaleDateString("en");

      const todayTemperature = weatherData.daily[0].temp.day.toFixed(0);
      const todayWindSpeed = weatherData.daily[0].wind_speed + " mph";
      const todayHumidity = weatherData.daily[0].humidity;

      console.log(
        `${todayDate}, ${todayTemperature}, ${todayWindSpeed}, ${todayHumidity}`
      );
      weatherData.daily.forEach((eachDay, index) => {
        if (index > 0) {
          const dayName = new Date(eachDay.dt * 1000).toLocaleDateString("en", {
            weekday: "short",
          });
          const temperature = eachDay.temp.day.toFixed(0);
          console.log(`${dayName}, ${temperature}°`);
        }
      });
    })
    .catch((error) => console.log("Fetch Error: " + error));
});
