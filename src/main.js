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
import {getDate, render, RenderPosition} from "./utils";

const POINT_COUNT = 15;
const points = generatePoints(POINT_COUNT);
const uniqueDates = new Set(points.map((point) => getDate(point.startTime)));

const renderPoint = (pointListElement, point) => {
  const replacePointToEdit = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };
  const replaceEditToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToPoint();
    }
  };

  const pointComponent = new PointComponent(point);
  const editButton = pointComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const pointEditComponent = new PointEditComponent(point);
  const editForm = pointEditComponent.getElement();
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToPoint();
  });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);

render(tripMainElement, new TripInfoComponent(points).getElement(), RenderPosition.AFTERBEGIN);
render(siteMenuTitle, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);
render(tripControlsElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new DaysListComponent().getElement(), RenderPosition.BEFOREEND);

const daysListElement = document.querySelector(`.trip-days`);

[...uniqueDates]
  .forEach((uniqueDate, index) => {
    render(daysListElement, new DayComponent(uniqueDate, index + 1).getElement(), RenderPosition.BEFOREEND);
    const eventsListElement = document.querySelectorAll(`.trip-events__list`)[index];

    points
      .filter((point) => getDate(point.startTime) === getDate(uniqueDate))
      .forEach((point) => {
        renderPoint(eventsListElement, point);
      });
  });
