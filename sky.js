let nightSky = document.querySelector("#sky-night");
let nightOcean = document.querySelector("#ocean-night");
let sun = document.querySelector("#sun");
let glow = document.querySelector("#glow");
let clock = document.querySelector("#clock");

function setSunAngle(angle) {
  sun.style.transform = `translate(-50%, -50%) rotate(${angle}rad) translateY(-22vmin)`;
  setDayNightTransition(1 - ((Math.cos(angle) * 2) / 3 + 1 / 3));
  setGlow(1 - Math.cos(2 * angle) - 1);
}

function setDayNightTransition(opacity) {
  nightSky.style.opacity = opacity;
  nightOcean.style.opacity = opacity;
}

function setGlow(opacity) {
  glow.style.opacity = opacity;
}

//function add cloud adds div with class 'cloud', starts at left 100%, moves left with transition. vertical position is random.
function addCloud(speed) {
  speed = speed * (Math.random() * 0.5 + 0.5);
  let cloud = document.createElement("div");
  cloud.classList.add("cloud");
  cloud.style.left = "140%";
  cloud.style.width = `${Math.random() * 50 + 10}%`;
  cloud.style.top = `${Math.random() * 50}%`;
  cloud.style.transition = `left ${speed}s linear`;
  document.querySelector("#center").appendChild(cloud);

  requestAnimationFrame(() => {
    cloud.style.left = "-100%";
  });

  setTimeout(() => {
    cloud.remove();
  }, speed * 1000 * 2);
}

function setMist(opacity) {
  document.querySelector("#mist").style.opacity = opacity;
}

let cloudDensity = 0.5;
let cloudSpeed = 20;
function setConditions(density, speed) {
  setMist(density);
  cloudDensity = density;
  cloudSpeed = speed;
}

setMist(cloudDensity);
setInterval(() => {
  if (Math.random() < cloudDensity) {
    addCloud(cloudSpeed);
  }
}, 200);

let angle = 0;
setInterval(() => {
  angle += 0.004;
  setSunAngle(angle);
});

function setClock() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  clock.innerHTML = `${hours}:${minutes}`;
}
setClock();

setInterval(() => {
  setClock();
}, 1000);
