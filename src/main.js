import FilterController from "./controllers/filter";
import PointsModel from "./models/points";
import SiteMenuComponent, {MenuItem} from "./components/site-menu";
import StatisticsComponent from "./components/statistics";
import TripInfoComponent from "./components/trip-info";
import TripController from "./controllers/trip";
import {generatePoints} from "./mock/point";
import {render, RenderPosition} from "./utils/render";

const POINT_COUNT = 15;
const points = generatePoints(POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);
const addEventButton = document.querySelector(`.trip-main__event-add-btn`);

render(tripMainElement, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);

const siteMenuComponent = new SiteMenuComponent();
render(siteMenuTitle, siteMenuComponent, RenderPosition.AFTEREND);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render(points);

const statisticsComponent = new StatisticsComponent(points);
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
