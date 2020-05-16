import DayComponent from "./components/day";
import DaysListComponent from "./components/days-list";
import FilterComponent from "./components/filter";
import PointEditComponent from "./components/point-edit";
import PointComponent from "./components/point";
import SiteMenuComponent from "./components/site-menu";
import SortComponent from "./components/sort";
import TripInfoComponent from "./components/trip-info";
import NoPointsComponent from "./components/no-points";
import {generatePoints} from "./mock/point";
import {filters} from "./const";
import {getDate} from "./utils/common";
import {render, RenderPosition, replace} from "./utils/render";

const POINT_COUNT = 15;
const points = generatePoints(POINT_COUNT);
const uniqueDates = new Set(points.map((point) => getDate(point.startTime)));

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
    }
  );

  const pointEditComponent = new PointEditComponent(point);
  pointEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToPoint();
  });

  render(pointListElement, pointComponent, RenderPosition.BEFOREEND);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);

const renderBoard = () => {
  if (points.length === 0) {
    render(tripEventsElement, new NoPointsComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(tripEventsElement, new SortComponent(), RenderPosition.BEFOREEND);
  render(tripEventsElement, new DaysListComponent(), RenderPosition.BEFOREEND);

  const daysListElement = document.querySelector(`.trip-days`);

  [...uniqueDates]
    .forEach((uniqueDate, index) => {
      render(daysListElement, new DayComponent(uniqueDate, index + 1), RenderPosition.BEFOREEND);
      const eventsListElement = document.querySelectorAll(`.trip-events__list`)[index];

      points
        .filter((point) => getDate(point.startTime) === getDate(uniqueDate))
        .forEach((point) => {
          renderPoint(eventsListElement, point);
        });
    });
};

render(tripMainElement, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);
render(siteMenuTitle, new SiteMenuComponent(), RenderPosition.AFTEREND);
render(tripControlsElement, new FilterComponent(filters), RenderPosition.BEFOREEND);
renderBoard();
