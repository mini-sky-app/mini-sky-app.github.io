let nightSky = document.querySelector("#sky-night");
let nightOcean = document.querySelector("#ocean-night");
let sun = document.querySelector("#sun");
let glow = document.querySelector("#glow");
let clock = document.querySelector("#clock");

function setSunAngle(angle) {
  sun.style.transform = `translate(-50%, -50%) rotate(${angle}rad) translateY(-22vmin)`;
  setDayNightTransition(1 - ((Math.cos(angle) * 2) / 3 + 1 / 3));
  if(angle > - Math.PI / 2 && angle < Math.PI / 2) {
    setGlow(1 - Math.cos(2 * angle) - 1);
  } else {
    setGlow(1 - 1.8 * Math.cos(2 * angle) - 1.8);
  }
}

function setDayNightTransition(opacity) {
  nightSky.style.opacity = opacity;
  nightOcean.style.opacity = opacity;
}

function setGlow(opacity) {
  glow.style.opacity = opacity;
}

let cloudDensity = 0.2;
let cloudSpeed = 0.1;
function setClouds(density, speed) {
  cloudDensity = density;
  cloudSpeed = speed;
}

//function add cloud adds div with class 'cloud', starts at left 100%, moves left with transition. vertical position is random.
function addCloud(speed, location) {
  speed = speed * (Math.random() * 0.5 + 0.5);
  let cloud = document.createElement("div");
  cloud.classList.add("cloud");
  cloud.style.left = `${location}%`;
  cloud.style.width = `${Math.random() * 50 + 10}%`;
  cloud.style.top = `${Math.random() * 50}%`;
  document.querySelector("#center").appendChild(cloud);

  let cloudMover = setInterval(()=>{
        cloud.style.left = `${location-= speed / 5}%`;
        if (location < -200) {
            cloud.remove();
            clearInterval(cloudMover);
        }
    }, 5);

}

//based on speed, add clouds instantly into the sky at the beginning
function spawnClouds() {
    //time taken for 1 cloud to move from left to right divided by cloud spawn rate
    //400 / cloudSpeed frames
    for (let i = 0; i < 50 ; i++) {
        if(Math.random() < cloudDensity) {
            addCloud(cloudSpeed, Math.random() * 400 - 200);
        }
    }
}

setInterval(() => {
  if (Math.random() < cloudDensity * cloudSpeed / 10) {
    addCloud(cloudSpeed, 200);
  }
}, 20);


function setMist(opacity) {
  document.querySelector("#mist").style.opacity = opacity;
}

precipitation = 0;
function setPrecipitation(p) {
  precipitation = p;
}

function addRain(){
  let rain = document.createElement("div");
  rain.classList.add("rain");
  let top = -100;
  let left = Math.random() * 150;
  rain.style.height = `${Math.random() * 30 + 5}%`;
  rain.style.left = `${left}%`;
  rain.style.top = `${top}%`;
  document.querySelector("#center").appendChild(rain);

  let rainMover = setInterval(()=>{
    rain.style.top = `${top++}%`;
    rain.style.left = `${left-=0.35}%`;
    if(top > 50 && Math.random() < 0.1) {
      rain.remove();
      clearInterval(rainMover);
    }
    if (top > 200) {
      rain.remove();
      clearInterval(rainMover);
    }
  });
}

setInterval(() => {
  if (Math.random() < precipitation) {
    addRain();
  }
}, 20);

let sunrise = 6 * 60 * 60 * 1000;
let sunset = 18 * 60 * 60 * 1000;

function setSunTimes(r, s) {
    let now = new Date();
    let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    sunrise = new Date(r * 1000) - startOfDay;
    sunset = new Date(s * 1000) - startOfDay;
    calculateSunAngle();
}

function calculateSunAngle() {
  let angle = 0;
  let now = new Date();
  let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let time = now - startOfDay;
  angle = (time - sunrise) / (sunset - sunrise) * Math.PI - Math.PI / 2;

  setSunAngle(angle);
}
calculateSunAngle();

setInterval(() => {
    calculateSunAngle();
}, 1000);

function setClock() {
  let date = new Date();
  let hours = date.getHours() % 12 || 12;
  let minutes = date.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  clock.innerHTML = `${hours}:${minutes}`;
}
setClock();

setInterval(() => {
  setClock();
}, 1000);
