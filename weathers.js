function getWeatherData() {
  return new Promise((resolve, reject) => {
    let latitude, longitude; // user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        const API_KEY = "3221ba97b0332bd1865ae65794a5c077";
        const API_LINK = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts&units=metric&appid=`;

        fetch(API_LINK + API_KEY)
          .then((response) => response.json())
          .then((weatherData) => {
            console.log(weatherData);
            const weatherDataObj = {};
            const weekWeatherData = {};
            const todayDate = new Date(
              weatherData.current.dt * 1000
            ).toLocaleDateString("en");

            weatherDataObj.todayWeekDay = new Date(
              weatherData.current.dt * 1000
            ).toLocaleDateString("en", { weekday: "short" });

            weatherDataObj.todayDate = todayDate;
            weatherDataObj.todaySunrise = weatherData.current.sunrise;
            weatherDataObj.todaySunset = weatherData.current.sunset;
            weatherDataObj.todayTemp = weatherData.current.temp.toFixed(0);
            weatherDataObj.todayWindSpeed =
              weatherData.current.wind_speed + " m/s";
            weatherDataObj.todayHumidity = weatherData.current.humidity;
            weatherDataObj.todayClouds = weatherData.current.clouds;
            weatherDataObj.todayVisibility = weatherData.current.visibility;
            weatherDataObj.todayPrecipitation =
              (weatherData.current?.rain?.["1h"] ?? 0) / 3;

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

function setWeatherData() {
  getWeatherData().then((weatherData) => {
    setClouds(
      weatherData.todayClouds / 100,
      parseInt(weatherData.todayWindSpeed) / 30
    );
    spawnClouds();
    setSunTimes(weatherData.todaySunrise, weatherData.todaySunset);
    setMist(1 - weatherData.todayVisibility / 10000);
    setPrecipitation(weatherData.todayPrecipitation);
    const weekWeather = document.getElementById("week-weather");
    const weekWeatherDataKeys = Object.keys(weatherData.weekWeatherData);

    weekWeather.innerHTML = "";
    for (let eachDay = 1; eachDay < 5; eachDay++) {
      // exclude today
      let newSpan = document.createElement("span");
      let eachDayName = weekWeatherDataKeys[eachDay];
      let weatherValue = `${eachDayName.toUpperCase()} ${
        weatherData.weekWeatherData[eachDayName]
      }°`;

      if (eachDay !== 4) {
        // if not the last day
        weatherValue += " / ";
      }

      newSpan.textContent = weatherValue;
      weekWeather.appendChild(newSpan);
    }
    document.querySelector(
      "#date"
    ).innerHTML = `DATE: ${weatherData.todayDate}`;
    document.querySelector(
      "#temperature"
    ).innerHTML = `TEMPERATURE: ${weatherData.todayTemp}°C`;
    document.querySelector(
      "#wind-speed"
    ).innerHTML = `WIND SPEED: ${weatherData.todayWindSpeed}`;
    document.querySelector(
      "#clouds"
    ).innerHTML = `CLOUD COVER: ${weatherData.todayClouds}%`;
  });
}

setWeatherData();

setInterval(() => {
  setWeatherData();
}, 20 * 60 * 1000);
