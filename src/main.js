import {createDayTemplate} from "./components/day";
import {createDaysListTemplate} from "./components/days-list";
import {createFilterTemplate} from "./components/filter";
import {createPointEditTemplate} from "./components/point-edit";
import {createPointTemplate} from "./components/point";
import {createSiteMenuTemplate} from "./components/site-menu";
import {createSortTemplate} from "./components/sort";
import {createTripInfoTemplate} from "./components/trip-info";
import {generatePoints} from "./mock/point";

const POINT_COUNT = 15;
const points = generatePoints(POINT_COUNT);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);

render(tripMainElement, createTripInfoTemplate(points), `afterbegin`);
render(siteMenuTitle, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate(), `beforeend`);
render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createPointEditTemplate(points[0]), `beforeend`);
render(tripEventsElement, createDaysListTemplate(), `beforeend`);

const daysListElement = document.querySelector(`.trip-days`);

render(daysListElement, createDayTemplate(), `beforeend`);

const eventsListElement = document.querySelector(`.trip-events__list`);

points.slice(1)
  .forEach((point) => render(eventsListElement, createPointTemplate(point), `beforeend`));
