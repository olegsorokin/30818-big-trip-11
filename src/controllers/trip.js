import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import NoPointsComponent from "../components/no-points";
import SortComponent from "../components/sort";
import DaysListComponent from "../components/days-list";
import DayComponent from "../components/day";
import {getDate} from "../utils/common";
import {render, RenderPosition, replace} from "../utils/render";

const renderPoint = (pointListElement, point) => {
  const replacePointToEdit = () => {
    replace(pointEditComponent, pointComponent);
  };
  const replaceEditToPoint = () => {
    replace(pointComponent, pointEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToPoint();
    }
  };

  const pointComponent = new PointComponent(point);
  pointComponent.setRollupButtonClickHandler(() => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const pointEditComponent = new PointEditComponent(point);
  pointEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToPoint();
  });

  render(pointListElement, pointComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(points) {
    const container = this._container;
    const uniqueDates = new Set(points.map((point) => getDate(point.startTime)));

    if (points.length === 0) {
      render(container, new NoPointsComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, new SortComponent(), RenderPosition.BEFOREEND);
    render(container, new DaysListComponent(), RenderPosition.BEFOREEND);

    const daysListElement = document.querySelector(`.trip-days`);

    [...uniqueDates]
      .forEach((uniqueDate, index) => {
        const dayComponent = new DayComponent(uniqueDate, index + 1);

        render(daysListElement, dayComponent, RenderPosition.BEFOREEND);
        const eventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

        points
          .filter((point) => getDate(point.startTime) === getDate(uniqueDate))
          .forEach((point) => {
            renderPoint(eventsListElement, point);
          });
      });
  }
}
