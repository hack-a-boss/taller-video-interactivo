import { events } from "./events.js";

export const secondsToDuration = (seconds) => {
  return new Date(seconds * 1000).toISOString().slice(14, 19);
};

export const getEvents = (second) => {
  return events.filter((event) => second >= event.from && second <= event.to);
};
