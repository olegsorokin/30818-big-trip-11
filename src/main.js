import {createDayTemplate} from "./components/day";
import {createDaysListTemplate} from "./components/days-list";
import {createFilterTemplate} from "./components/filter";
import {createPointEditTemplate} from "./components/point-edit";
import {createPointTemplate} from "./components/point";
import {createSiteMenuTemplate} from "./components/site-menu";
import {createSortTemplate} from "./components/sort";
import {createTripInfoTemplate} from "./components/trip-info";
import {generatePoints} from "./mock/point";
import {filters} from "./const";
import {getDate} from "./utils";

const POINT_COUNT = 15;
const points = generatePoints(POINT_COUNT);
const uniqueDates = new Set(points.map((point) => getDate(point.startTime)));

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);

render(tripMainElement, createTripInfoTemplate(points), `afterbegin`);
render(siteMenuTitle, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate(filters), `beforeend`);
render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createPointEditTemplate(points[0]), `beforeend`);
render(tripEventsElement, createDaysListTemplate(), `beforeend`);

const daysListElement = document.querySelector(`.trip-days`);

[...uniqueDates]
  .forEach((uniqueDate, index) => {
    render(daysListElement, createDayTemplate(uniqueDate, index + 1), `beforeend`);
    const eventsListElement = document.querySelectorAll(`.trip-events__list`)[index];

    points
      .filter((point) => getDate(point.startTime) === getDate(uniqueDate))
      .forEach((point) => {
        render(eventsListElement, createPointTemplate(point), `beforeend`);
      });
  });
