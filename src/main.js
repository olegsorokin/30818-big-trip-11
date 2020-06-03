import API from "./api";
import AppController from "./controllers/app";
import PointsModel from "./models/points";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yQQq=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const appController = new AppController(tripMainElement, pointsModel, api);

appController.init();
