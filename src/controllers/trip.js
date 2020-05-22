import NoPointsComponent from "../components/no-points";
import SortComponent, {SortType} from "../components/sort";
import DaysListComponent from "../components/days-list";
import DayComponent from "../components/day";
import PointController from "./point";
import {getDate} from "../utils/common";
import {render, RenderPosition} from "../utils/render";

const renderDay = (container, points, onDataChange, date, index) => {
  const dayComponent = new DayComponent(date, index);

  render(container, dayComponent, RenderPosition.BEFOREEND);
  const pointsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

  return points.map((point) => {
    const pointController = new PointController(pointsListElement, onDataChange);

    pointController.render(point);

    return pointController;
  });
};

const renderDays = (container, points, sortType, onDataChange) => {
  let showedPointControllers = [];

  switch (sortType) {
    case SortType.EVENT:
      const uniqueDates = new Set(points.map((point) => getDate(point.startTime)));

      [...uniqueDates]
        .forEach((uniqueDate, index) => {
          const filteredPoints = points.filter((point) => getDate(point.startTime) === getDate(uniqueDate));
          showedPointControllers = showedPointControllers.concat(renderDay(container, filteredPoints, onDataChange, uniqueDate, index + 1));
        });
      break;
    case SortType.PRICE:
      showedPointControllers = showedPointControllers.concat(renderDay(container, points, onDataChange));
      break;
    case SortType.TIME:
      showedPointControllers = showedPointControllers.concat(renderDay(container, points, onDataChange));
      break;
  }

  return showedPointControllers;
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

    this._points = [];
    this._showedPointControllers = [];
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(points) {
    this._points = points;
    const container = this._container;

    if (this._points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysListComponent, RenderPosition.BEFOREEND);

    const newPoints = renderDays(this._daysListComponent.getElement(), this._points, this._sortComponent.getSortType(), this._onDataChange);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._points, sortType);

    this._daysListComponent.getElement().innerHTML = ``;
    renderDays(this._daysListComponent.getElement(), sortedPoints, sortType, this._onDataChange);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    pointController.render(this._points[index]);
  }
}
