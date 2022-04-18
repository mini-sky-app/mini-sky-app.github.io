function getWeatherData() {
  return new Promise((resolve, reject) => {
    let latitude, longitude; // user

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        const API_KEY = "3221ba97b0332bd1865ae65794a5c077";
        const API_LINK = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts&units=metric&appid=`;

        const xhr = new XMLHttpRequest();
        xhr.open(
          "GET",
          "https://us1.locationiq.com/v1/reverse.php?key=pk.93282e72d3c4c7d23e602a8cca1d469a	&lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&format=json",
          true
        );
        xhr.send();
        xhr.onreadystatechange = processReq;
        xhr.addEventListener("readystatechange", processReq, false);

        function processReq(e) {
          if (xhr.readyState == 4 && xhr.status == 200) {
            const res = JSON.parse(xhr.responseText);
            const city = res.address.city;
            document.getElementById("city").innerHTML = city;
            return;
          }
        }

        fetch(API_LINK + API_KEY)
          .then((response) => response.json())
          .then((weatherData) => {
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

function setWeatherData(unit, changed) {
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
      let eachDayTemperature = weatherData.weekWeatherData[eachDayName];
      if (changed == 1 && unit == "F") {
        eachDayTemperature = (1.8 * eachDayTemperature + 32).toFixed(0);
      }
      let weatherValue = `${eachDayName.toUpperCase()} ${eachDayTemperature}°`;

      if (eachDay !== 4) {
        // if not the last day
        weatherValue += " / ";
      }

      newSpan.textContent = weatherValue;
      weekWeather.appendChild(newSpan);
    }

    let todayTemperature = weatherData.todayTemp;

    if (changed == 1 && unit == "F") {
      todayTemperature = (1.8 * todayTemperature + 32).toFixed(0);
    }

    document.querySelector(
      "#date"
    ).innerHTML = `DATE: ${weatherData.todayDate}`;
    document.querySelector(
      "#temperature"
    ).innerHTML = `TEMPERATURE: ${todayTemperature}°${unit}`;
    document.querySelector(
      "#wind-speed"
    ).innerHTML = `WIND SPEED: ${weatherData.todayWindSpeed}`;
    document.querySelector(
      "#clouds"
    ).innerHTML = `CLOUD COVER: ${weatherData.todayClouds}%`;
  });
}

let unit = "C";
let changed = 0;
const celsiusBtn = document.getElementById("celsius");
const fahrenheitBtn = document.getElementById("fahrenheit");

celsiusBtn.addEventListener("click", () => {
  if (unit == "F") {
    unit = "C";
    changed = 1;
    celsiusBtn.style.opacity = "1.0";
    fahrenheitBtn.style.opacity = "0.44";
    setWeatherData(unit, changed);
  }
});

fahrenheitBtn.addEventListener("click", () => {
  if (unit == "C") {
    unit = "F";
    changed = 1;
    celsiusBtn.style.opacity = "0.44";
    fahrenheitBtn.style.opacity = "1.0";
    setWeatherData(unit, changed);
  }
});

setWeatherData(unit, 0);

setInterval(() => {
  setWeatherData(unit, 0);
}, 20 * 60 * 1000);
