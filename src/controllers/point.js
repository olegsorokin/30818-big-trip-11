import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import PointModel from "../models/point";
import {render, remove, RenderPosition, replace} from "../utils/render";
import {cities, offersList, transferTypes} from "../const";
import {parseDate} from "../utils/common";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const parseFormData = (formData) => {
  const offers = offersList.filter((offer) => formData.get(`event-offer-${offer.type}`));
  const startTime = formData.get(`event-start-time`);
  const endTime = formData.get(`event-end-time`);

  return {
    startTime: startTime ? parseDate(startTime) : null,
    endTime: endTime ? parseDate(endTime) : null,
    type: formData.get(`event-type`),
    city: formData.get(`event-destination`),
    price: formData.get(`event-price`),
    offers
  };
};

export const EmptyPoint = {
  type: transferTypes[0],
  city: cities[0],
  startTime: new Date(),
  endTime: new Date(),
  price: 0,
  offers: [],
  pictures: [],
  description: ``,
  isFavorite: false
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

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData);

      this._onDataChange(this, point, Object.assign({}, point, data));
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    this._pointEditComponent.setFavoritesChangeHandler((evt) => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = evt.target.checked;

      this._onDataChange(this, point, newPoint);
    });

    this._pointEditComponent.setTypeChangeHandler((evt) => {
      this._onDataChange(this, point, Object.assign({}, point, {
        type: evt.target.value
      }));
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
