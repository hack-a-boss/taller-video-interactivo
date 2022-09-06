import { getEvents, secondsToDuration } from "./helpers.js";

const app = document.querySelector("main");

const video = app.querySelector("video");

const controls = app.querySelector("section.controls");
const data = app.querySelector("section.data");

const play = controls.querySelector("button.play");
const pause = controls.querySelector("button.pause");
const fullscreen = controls.querySelector("button.fullscreen");
const current = controls.querySelector("time.current");
const duration = controls.querySelector("time.duration");
const progress = controls.querySelector("progress");

let bootstrapped = false;
let fadeTimeout;
let currentEvents = [];

// Inicialización

const bootstrap = () => {
  controls.classList.remove("faded");
  duration.textContent = secondsToDuration(video.duration);
  progress.max = video.duration;
  bootstrapped = true;
};

if (video.readyState >= 2) {
  bootstrap();
} else {
  video.addEventListener("loadeddata", bootstrap);
}

// Gestión de full screen
fullscreen.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    app.requestFullscreen().catch((error) => console.error(error));
  } else {
    document.exitFullscreen().catch((error) => console.error(error));
  }
});

// Gestión de play y pause
play.addEventListener("click", () => {
  video.play();
  pause.hidden = false;
  play.hidden = true;
});

pause.addEventListener("click", () => {
  video.pause();
  pause.hidden = true;
  play.hidden = false;
});

// Gestión de timeline

video.addEventListener("timeupdate", () => {
  current.textContent = secondsToDuration(video.currentTime);
  progress.value = video.currentTime;

  const events = getEvents(video.currentTime);

  if (JSON.stringify(events) !== JSON.stringify(currentEvents)) {
    setEvents(events);
  }
});

// Gestión de aparición/desaparición de la barra de controles

video.addEventListener("mousemove", () => {
  if (bootstrapped) {
    controls.classList.remove("faded");

    clearTimeout(fadeTimeout);

    fadeTimeout = setTimeout(() => {
      controls.classList.add("faded");
    }, 3000);
  }
});

// Gestión de la barra de progreso

progress.addEventListener("click", (e) => {
  const x = e.pageX - progress.offsetLeft;
  const value = (x * progress.max) / progress.offsetWidth;

  video.currentTime = value;
});

// Escribe los eventos
const setEvents = (events) => {
  currentEvents = events;

  data.innerHTML = `
    <ul>
      ${events.map((event) => `<li>${event.content}</li>`).join("")}
    </ul>
  `;
};
