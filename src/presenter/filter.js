import FilterComponent from "../view/filter.js";
import {render, replace, remove} from "../utils/render.js";
import {FilterType, UpdateType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, dataModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._dataModel = dataModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._dataModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters, this._currentFilter, this._dataModel.getPoints());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    if (this._filterComponent) {
      const currentFilterComponent = new FilterComponent(this._getFilters(), this._currentFilter, this._dataModel.getPoints());
      replace(currentFilterComponent, this._filterComponent);
      this._filterComponent = currentFilterComponent;
      // remove(currentFilterComponent);
      }
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
      },
      {
        type: FilterType.FUTURE,
      },
      {
        type: FilterType.PAST,
      }
    ];
  }

  destroy() {
    remove(this._filterComponent);
  }
}
