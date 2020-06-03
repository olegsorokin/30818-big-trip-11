import FilterController from "./filter";
import LoadingComponent from "../components/loading";
import SiteMenuComponent, {MenuItem} from "../components/site-menu";
import StatisticsComponent from "../components/statistics";
import TripInfoComponent from "../components/trip-info";
import TripController from "./trip";
import {remove, render, RenderPosition} from "../utils/render";

export default class AppController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._tripInfoComponent = null;

    this._updateTripInfo = this._updateTripInfo.bind(this);

    this._pointsModel.setDataChangeHandler(this._updateTripInfo);
  }

  init() {
    this._tripInfoComponent = new TripInfoComponent(this._pointsModel);
    render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN)

    const tripControlsElement = document.querySelector(`.trip-controls`);
    const tripEventsElement = document.querySelector(`.trip-events`);
    const siteMenuTitle = document.querySelector(`.trip-controls h2:first-child`);
    const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
    const siteMenuComponent = new SiteMenuComponent();
    const loadingComponent = new LoadingComponent();
    const filterController = new FilterController(tripControlsElement, this._pointsModel);
    const tripController = new TripController(tripEventsElement, this._pointsModel, this._api);
    const statisticsComponent = new StatisticsComponent(this._pointsModel);

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
    });

    Promise.all([
      this._api.getPoints(),
      this._api.getDestinations(),
      this._api.getOffers()
    ])
      .then((response) => {
        const [points, destinations, offers] = response;
        remove(loadingComponent);
        this._pointsModel.setPoints(points);
        tripController.render(destinations, offers);
      });
  }

  _updateTripInfo() {
    this._tripInfoComponent.rerender();
  }
}
