import DayComponent from "./components/day";
import DaysListComponent from "./components/days-list";
import FilterComponent from "./components/filter";
import PointEditComponent from "./components/point-edit";
import PointComponent from "./components/point";
import SiteMenuComponent from "./components/site-menu";
import SortComponent from "./components/sort";
import TripInfoComponent from "./components/trip-info";
import {generatePoints} from "./mock/point";
import {filters} from "./const";
import {getDate, render} from "./utils";

const POINT_COUNT = 15;
const points = generatePoints(POINT_COUNT);
const uniqueDates = new Set(points.map((point) => getDate(point.startTime)));

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);

render(tripMainElement, new TripInfoComponent(points).getElement(), `afterbegin`);
render(siteMenuTitle, new SiteMenuComponent().getElement(), `afterend`);
render(tripControlsElement, new FilterComponent(filters).getElement(), `beforeend`);
render(tripEventsElement, new SortComponent().getElement(), `beforeend`);
render(tripEventsElement, new PointEditComponent(points[0]).getElement(), `beforeend`);
render(tripEventsElement, new DaysListComponent().getElement(), `beforeend`);

const daysListElement = document.querySelector(`.trip-days`);

[...uniqueDates]
  .forEach((uniqueDate, index) => {
    render(daysListElement, new DayComponent(uniqueDate, index + 1).getElement(), `beforeend`);
    const eventsListElement = document.querySelectorAll(`.trip-events__list`)[index];

    points
      .filter((point) => getDate(point.startTime) === getDate(uniqueDate))
      .forEach((point) => {
        render(eventsListElement, new PointComponent(point).getElement(), `beforeend`);
      });
  });
