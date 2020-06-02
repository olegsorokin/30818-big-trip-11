import API from "./api";
import FilterController from "./controllers/filter";
import LoadingComponent from "./components/loading";
import PointsModel from "./models/points";
import SiteMenuComponent, {MenuItem} from "./components/site-menu";
import StatisticsComponent from "./components/statistics";
import TripController from "./controllers/trip";
import TripInfoComponent from "./components/trip-info";
import {remove, render, RenderPosition} from "./utils/render";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yQQq=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);
const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
const siteMenuComponent = new SiteMenuComponent();
const loadingComponent = new LoadingComponent();
const filterController = new FilterController(tripControlsElement, pointsModel);
const tripController = new TripController(tripEventsElement, pointsModel, api);
const statisticsComponent = new StatisticsComponent(pointsModel);

render(siteMenuTitle, siteMenuComponent, RenderPosition.AFTEREND);
render(tripEventsElement, loadingComponent, RenderPosition.BEFOREEND);
filterController.render();
render(tripEventsElement, statisticsComponent, RenderPosition.AFTEREND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

addEventButton.addEventListener(`click`, () => {
  siteMenuComponent.setActiveItem(MenuItem.NEW_POINT);
  statisticsComponent.hide();
  tripController.show();
  tripController.createPoint();
})

Promise.all([
    api.getPoints(),
    api.getDestinations(),
    api.getOffers()
  ])
  .then((response) => {
    const [points, destinations, offers] = response;
    console.log(points);
    remove(loadingComponent);
    pointsModel.setPoints(points);
    render(tripMainElement, new TripInfoComponent(pointsModel), RenderPosition.AFTERBEGIN);
    tripController.render(destinations, offers);
  });
