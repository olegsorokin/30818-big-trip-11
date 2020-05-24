import FilterComponent from "./components/filter";
import PointsModel from "./models/points";
import SiteMenuComponent from "./components/site-menu";
import TripInfoComponent from "./components/trip-info";
import TripController from "./controllers/trip";
import {generatePoints} from "./mock/point";
import {filters} from "./const";
import {render, RenderPosition} from "./utils/render";

const POINT_COUNT = 15;
const points = generatePoints(POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);

render(tripMainElement, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);
render(siteMenuTitle, new SiteMenuComponent(), RenderPosition.AFTEREND);
render(tripControlsElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render(points);
