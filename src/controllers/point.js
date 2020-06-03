import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import PointModel from "../models/point";
import {render, remove, RenderPosition, replace} from "../utils/render";
import {transferTypes} from "../const";
import {parseDate} from "../utils/common";

const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const EmptyPoint = {
  type: transferTypes[0],
  city: ``,
  startTime: new Date(),
  endTime: new Date(),
  price: 0,
  offers: [],
  pictures: [],
  description: ``,
  isFavorite: false
};

const parseFormData = (formData, destinationsList, offersList) => {
  const city = formData.get(`event-destination`);
  const currentDestination = destinationsList.find((it) => it.name === city);
  const description = currentDestination.description;
  const pictures = currentDestination.pictures;
  const type = formData.get(`event-type`);
  const currentOffersList = offersList.find((it) => it.type === type).offers;
  const offers = currentOffersList.filter((it, index) => formData.get(`event-offer-${index}`));
  const startTime = formData.get(`event-start-time`);
  const endTime = formData.get(`event-end-time`);

  return new PointModel({
    type,
    offers,
    'date_from': startTime ? parseDate(startTime) : null,
    'date_to': endTime ? parseDate(endTime) : null,
    'destination': {
      'name': city,
      description,
      pictures
    },
    'base_price': Number(formData.get(`event-price`)),
    'is_favorite': Boolean(formData.get(`event-favorite`))
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, destinations, offers) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._destinations = destinations;
    this._offers = offers;
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, this._destinations, this._offers);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setRollupButtonClickHandler(() => {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }

      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData, this._destinations, this._offers);

      if (data.startTime > data.endTime) {
        this._pointEditComponent.getElement()
          .querySelector(`.event__field-group--time`).classList.add(`event__field-group--error`);

        this.shake();
        return;
      }

      this._pointEditComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, point, data);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => {
      this._pointEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });

      this._onDataChange(this, point, null);
    });

    this._pointEditComponent.setFavoritesChangeHandler((evt) => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = evt.target.checked;

      this._onDataChange(this, point, newPoint);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointComponent && oldPointEditComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  destroy() {
    remove(this._pointEditComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  shake() {
    this._pointEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointComponent.getElement().style.animation = ``;

      this._pointEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();

    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export {Mode, EmptyPoint};
