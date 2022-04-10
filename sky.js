let nightSky = document.querySelector('#sky-night');
let nightOcean = document.querySelector('#ocean-night');
let sun = document.querySelector('#sun');
let glow = document.querySelector('#glow');
let clock = document.querySelector('#clock');

function setSunAngle(angle){
    sun.style.transform = `translate(-50%, -50%) rotate(${angle}rad) translateY(-22vmin)`;
    setDayNightTransition(1 - (Math.cos(angle)*2/3 + 1/3));
    setGlow(Math.pow(Math.sin(angle),2)*2 - 1)
}

function setDayNightTransition(opacity){
    nightSky.style.opacity = opacity;
    nightOcean.style.opacity = opacity;
}

function setGlow(opacity){
    glow.style.opacity = opacity;
}

let angle = 0
setInterval(()=>{
    angle += 0.004;
    setSunAngle(angle);
})

function setClock(){
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    clock.innerHTML = `${hours}:${minutes}`;
}
setClock();

setInterval(() => {
    setClock();
}, 1000);
