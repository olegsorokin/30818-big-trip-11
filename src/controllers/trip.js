import NoPointsComponent from "../components/no-points";
import SortComponent, {SortType} from "../components/sort";
import DaysListComponent from "../components/days-list";
import DayComponent from "../components/day";
import PointController from "./point";
import {getDate} from "../utils/common";
import {render, RenderPosition} from "../utils/render";

const renderDay = (container, points, date, index) => {
  const dayComponent = new DayComponent(date, index);

  render(container, dayComponent, RenderPosition.BEFOREEND);
  const eventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

  points
    .forEach((point) => {
      new PointController(eventsListElement).render(point);
    });
};

const renderDays = (container, points, sortType) => {
  switch (sortType) {
    case SortType.EVENT:
      const uniqueDates = new Set(points.map((point) => getDate(point.startTime)));

      [...uniqueDates]
        .forEach((uniqueDate, index) => {
          const filteredPoints = points.filter((point) => getDate(point.startTime) === getDate(uniqueDate));
          renderDay(container, filteredPoints, uniqueDate, index + 1);
        });
      break;
    case SortType.PRICE:
      renderDay(container, points);
      break;
    case SortType.TIME:
      renderDay(container, points);
      break;
  }
};

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const showingPoints = points.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = showingPoints;
      break;
    case SortType.PRICE:
      sortedPoints = showingPoints.sort((a, b) => a.price - b.price);
      break;
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => a.startTime - b.startTime);
      break;
  }

  return sortedPoints;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
  }

  render(points) {
    const container = this._container;

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysListComponent, RenderPosition.BEFOREEND);

    this._sortComponent.setSortTypeChangeHandler((currentSortType) => {
      const sortedPoints = getSortedPoints(points, currentSortType);

      this._daysListComponent.getElement().innerHTML = ``;
      renderDays(this._daysListComponent.getElement(), sortedPoints, currentSortType);
    });

    renderDays(this._daysListComponent.getElement(), points, this._sortComponent.getSortType());
  }
}
