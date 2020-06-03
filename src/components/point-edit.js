import AbstractSmartComponent from "./abstract-smart-component";
import {formatDate} from "../utils/common";
import {activityTypes, transferTypes, typesMap} from "../const";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createOfferMarkup = (offer, index, isChecked) => {
  const {title, price} = offer;
  const checked = isChecked ? `checked` : ``;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}-1" type="checkbox" name="event-offer-${index}" ${checked}>
      <label class="event__offer-label" for="event-offer-${index}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const generateOffersMarkup = (pointOffers, offersList) => {
  return offersList
    .map((offer, index) => createOfferMarkup(offer, index, pointOffers.some((pointOffer) => pointOffer.title === offer.title)))
    .join(`\n`);
};

const createDestinationOptionsMarkup = (cities) => {
  return cities
    .map((city) => `<option value="${city}"></option>`)
    .join(`\n`);
};

const createTypeMarkup = (type, index, currentType) => {
  const isChecked = currentType === type ? `checked` : ``;

  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index}">${typesMap[type]}</label>
    </div>`
  );
};

const generateTypesMarkup = (types, currentType) => {
  return types
    .map((it, index) => createTypeMarkup(it, index, currentType))
    .join(`\n`);
};

const generatePicturesMarkup = (pictures) => {
  if (!pictures) {
    return ``;
  }

  return pictures
    .map((it) => `<img class="event__photo" src="${it.src}" alt="${it.description}">`)
    .join(`\n`);
};

const createPointEditTemplate = (point, options) => {
  const {startTime, endTime, offers, isFavorite} = point;
  const {currentType, currentPictures, currentCity, currentPrice, currentDescription, destinationsList, offersList, externalData} = options;
  const type = currentType;

  const citiesList = destinationsList.map((it) => it.name);
  const offersListByType = offersList.find((it) => it.type === type).offers;

  const destinationOptionsMarkup = createDestinationOptionsMarkup(citiesList);
  const getStartTime = () => formatDate(startTime);
  const getEndTime = () => formatDate(endTime);
  const transfersMarkup = generateTypesMarkup(transferTypes, type);
  const activityMarkup = generateTypesMarkup(activityTypes, type);
  const picturesMarkup = generatePicturesMarkup(currentPictures);
  const offersMarkup = generateOffersMarkup(offers, offersListByType);
  const getTitle = () => {
    return activityTypes.includes(type) ? `${typesMap[type]} in` : `${typesMap[type]} to`;
  };
  const isBlockSaveButton = false;

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transfersMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getTitle()}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentCity}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationOptionsMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getStartTime()}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getEndTime()}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${currentPrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${currentDescription}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesMarkup}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point, destinations, offers) {
    super();

    this._point = point;
    this._destinationsList = destinations;
    this._offersList = offers;
    this._currentCity = point.city;
    this._currentPrice = point.price;
    this._currentDescription = point.description;
    this._currentType = point.type;
    this._currentPictures = point.pictures;
    this._externalData = DefaultData;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._submitHandler = null;
    this._rollupClickHandler = null;
    this._favoritesChangeHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createPointEditTemplate(this._point, {
      currentCity: this._currentCity,
      currentPrice: this._currentPrice,
      currentDescription: this._currentDescription,
      currentType: this._currentType,
      currentPictures: this._currentPictures,
      externalData: this._externalData,
      destinationsList: this._destinationsList,
      offersList: this._offersList
    });
  }

  removeElement() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }

    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._rollupClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoritesChangeHandler(this._favoritesChangeHandler);
    this._subscribeOnEvents();
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._rollupClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoritesChangeHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, handler);

    this._favoritesChangeHandler = handler;
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;

    this._currentCity = point.city;
    this._currentPrice = point.price;
    this._currentDescription = point.description;
    this._currentType = point.type;
    this._currentPictures = point.pictures;

    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }

    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }

    const startDateElements = this.getElement().querySelector(`.event__input--time[name='event-start-time']`);
    const endDateElements = this.getElement().querySelector(`.event__input--time[name='event-end-time']`);

    const setOptions = (defaultDate = `today`) => ({
      allowInput: true,
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      minDate: this._point.startTime,
      defaultDate
    });

    this._flatpickrStartDate = flatpickr(startDateElements, setOptions(this._point.startTime));
    this._flatpickrEndDate = flatpickr(endDateElements, setOptions(this._point.endTime));
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__input--destination`)
      .addEventListener(`input`, (evt) => {
        this._currentCity = evt.target.value;
        const destinationIndex = this._destinationsList.findIndex((it) => it.name === this._currentCity);

        if (destinationIndex !== -1) {
          this._currentDescription = this._destinationsList[destinationIndex].description;
          this._currentPictures = this._destinationsList[destinationIndex].pictures;

          this.rerender();
        }

        const saveButton = this.getElement().querySelector(`.event__save-btn`);
        saveButton.disabled = this._isDisabled();
      });

    element.querySelector(`.event__input--price`)
      .addEventListener(`input`, (evt) => {
        this._currentPrice = evt.target.value;

        const saveButton = this.getElement().querySelector(`.event__save-btn`);
        saveButton.disabled = this._isDisabled();
      });

    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        this._currentType = evt.target.value;

        this.rerender();
      });
  }

  _isDisabled() {
    const cities = this._destinationsList.map((it) => it.name);

    const hasCity = cities.includes(this._currentCity);
    const isValidPrice = this._currentPrice !== `` && !isNaN(this._currentPrice);

    return !(hasCity && isValidPrice);
  }
}
