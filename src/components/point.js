import {formatDiff, formatISO, formatTime} from "../utils/common";
import {activityTypes} from "../const";
import AbstractComponent from "./abstract-component";

const createOffersMarkup = (offers) => {
  return offers.length === 0 ? `` : offers
    .map((offer) => {
      const {title, price} = offer;
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </li>`
      );
    })
    .join(`\n`);
};

const createPointTemplate = (point) => {
  const {type, city, startTime, endTime, price, offers} = point;

  const isOffersShowing = !!offers;
  const offersMarkup = createOffersMarkup(offers);
  const getStartTime = () => formatTime(startTime);
  const getEndTime = () => formatTime(endTime);
  const duration = formatDiff(startTime, endTime);
  const getTitle = () => {
    return activityTypes.includes(type) ? `${type} in ${city}` : `${type} to ${city}`;
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getTitle()}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatISO(startTime)}">${getStartTime()}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatISO(endTime)}">${getEndTime()}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        ${
    isOffersShowing ?
      `<ul class="event__selected-offers">
        ${offersMarkup}
      </ul>`
      : ``
    }

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Point extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
