function getWeatherData() {
  return new Promise((resolve, reject) => {
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
            console.log(weatherData);
            const weatherDataObj = {}
            const weekWeatherData = {}
            const todayDate = new Date(
              weatherData.daily[0].dt * 1000
            ).toLocaleDateString("en");

            weatherDataObj.todayWeekDay = new Date(
              weatherData.daily[0].dt * 1000
            ).toLocaleDateString("en", { weekday: "short" });

            weatherDataObj.todayDate = todayDate;
            weatherDataObj.todaySunrise = weatherData.daily[0].sunrise;
            weatherDataObj.todaySunset = weatherData.daily[0].sunset;
            weatherDataObj.todayTemp = weatherData.daily[0].temp.day.toFixed(0);
            weatherDataObj.todayWindSpeed =
              weatherData.daily[0].wind_speed + " mph";
            weatherDataObj.todayHumidity = weatherData.daily[0].humidity;
            weatherDataObj.todayClouds = weatherData.daily[0].clouds;

            weatherData.daily.forEach((eachDay) => {
              const dayName = new Date(eachDay.dt * 1000).toLocaleDateString(
                "en",
                {
                  weekday: "short",
                }
              );
              const temperature = eachDay.temp.day.toFixed(0);
              weekWeatherData[dayName] = temperature;
            });
            weatherDataObj.weekWeatherData = weekWeatherData;
            resolve(weatherDataObj);
          })
          .catch((error) => console.log("Fetch Error: " + error));
      });
    }
  });
}

getWeatherData().then((weatherData) => {
  //do things here
  console.log(weatherData);
  setClouds(weatherData.todayClouds / 100, parseInt(weatherData.todayWindSpeed) / 30);
  spawnClouds()  
  setSunTimes(weatherData.todaySunrise, weatherData.todaySunset);
})
