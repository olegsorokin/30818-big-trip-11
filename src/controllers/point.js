import PointComponent from "../components/point";
import PointEditComponent from "../components/point-edit";
import {render, RenderPosition, replace} from "../utils/render";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point) {
    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setFavoriteChangeHandler((evt) => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: evt.target.checked
      }))
    });

    this._pointEditComponent.setTypeChangeHandler((evt) => {
      this._onDataChange(this, point, Object.assign({}, point, {
        type: evt.target.value
      }))
    });

    render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replacePointToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToPoint();
    }
  }
}
