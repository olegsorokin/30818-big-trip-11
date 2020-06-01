import NoPointsComponent from "../components/no-points";
import SortComponent, {SortType} from "../components/sort";
import DaysListComponent from "../components/days-list";
import DayComponent from "../components/day";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point";
import {getDayTimeStamp} from "../utils/common";
import {render, RenderPosition} from "../utils/render";
import {HIDDEN_CLASS} from "../const";

const renderDay = (container, points, onDataChange, onViewChange, date, index) => {
  const dayComponent = new DayComponent(date, index);

  render(container, dayComponent, RenderPosition.BEFOREEND);
  const pointsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

  return points.map((point) => {
    const pointController = new PointController(pointsListElement, onDataChange, onViewChange);

    pointController.render(point, PointControllerMode.DEFAULT);

    return pointController;
  });
};

const renderDays = (container, points, sortType, onDataChange, onViewChange) => {
  let showedPointControllers = [];

  switch (sortType) {
    case SortType.EVENT:
      const uniqueDates = new Set(points.map((point) => getDayTimeStamp(point.startTime)));

      [...uniqueDates]
        .forEach((uniqueDate, index) => {
          const filteredPoints = points.filter((point) => getDayTimeStamp(point.startTime) === getDayTimeStamp(uniqueDate));
          showedPointControllers = showedPointControllers.concat(renderDay(container, filteredPoints, onDataChange, onViewChange, uniqueDate, index + 1));
        });
      break;
    case SortType.PRICE:
      showedPointControllers = showedPointControllers.concat(renderDay(container, points, onDataChange, onViewChange));
      break;
    case SortType.TIME:
      showedPointControllers = showedPointControllers.concat(renderDay(container, points, onDataChange, onViewChange));
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
      sortedPoints = showingPoints.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => {
        const firstElement = (a.startTime - a.endTime);
        const secondElement = (b.startTime - b.endTime);

        return firstElement - secondElement;
      });
      break;
  }

  return sortedPoints;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._showedPointControllers = [];
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._creatingPoint = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  render() {
    const points = this._pointsModel.getPoints();
    const container = this._container;

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysListComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points.slice());
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const daysListElement = this._daysListComponent.getElement();
    this._creatingPoint = new PointController(daysListElement, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _removeDays() {
    this._daysListComponent.getElement().innerHTML = ``;
  }

  _removePoints() {
    this._showedPointControllers.forEach((pointController) => pointController.destroy());
    this._showedPointControllers = [];
  }

  _renderPoints(points) {
    const newPoints = renderDays(this._daysListComponent.getElement(), points, this._sortComponent.getSortType(), this._onDataChange, this._onViewChange);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  _updatePoints() {
    this._removePoints();
    this._removeDays();
    this._renderPoints(this._pointsModel.getPoints().slice());
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;

      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);

        this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);

    this._removePoints();
    this._removeDays();
    this._renderPoints(sortedPoints);
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
