import FilterComponent from "../components/filter";
import {FilterType} from "../const";
import {render, replace, RenderPosition} from "../utils/render";
import {getPointsByFilter} from "../utils/filter";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._filters = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const oldComponent = this._filterComponent;
    this._filters = this._getFiltersList();

    this._filterComponent = new FilterComponent(this._filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _getFiltersList() {
    return  Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
        isDisabled: !(getPointsByFilter(this._pointsModel.getPointsAll(), filterType).length)
      };
    });
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
