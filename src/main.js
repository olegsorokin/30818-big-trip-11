import {createDayTemplate} from "./components/day";
import {createDaysListTemplate} from "./components/days-list";
import {createFilterTemplate} from "./components/filter";
import {createPointEditTemplate} from "./components/point-edit";
import {createPointTemplate} from "./components/point";
import {createSiteMenuTemplate} from "./components/site-menu";
import {createSortTemplate} from "./components/sort";
import {createTripInfoTemplate} from "./components/trip-info";

const POINT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);
render(siteMenuTitle, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate(), `beforeend`);
render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createPointEditTemplate(), `beforeend`);
render(tripEventsElement, createDaysListTemplate(), `beforeend`);

const daysListElement = document.querySelector(`.trip-days`);

render(daysListElement, createDayTemplate(), `beforeend`);

const eventsListElement = document.querySelector(`.trip-events__list`);

for (let i = 0; i < POINT_COUNT; i++) {
  render(eventsListElement, createPointTemplate(), `beforeend`);
}
