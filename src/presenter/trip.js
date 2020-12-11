import SortingPointComponent from '../view/sorting-task.js';
import PointListComponent from '../view/point-list.js';
import PointPresenter from "./point.js";
import NoPointComponent from '../view/no-points.js';
import {render} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {sotrDays, sortTime, sortPrice} from '../utils/task.js';
import {SortType} from "../const.js";

export default class Trip {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;
    this._currentSortType = SortType.DAY;
    this._pointPresenter = {};

    this._sortComponent = new SortingPointComponent();
    this._pointListComponent = new PointListComponent();
    this._noTaskComponent = new NoPointComponent();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice().sort(sotrDays);
    this._sourcedPoints = points.slice().sort(sotrDays);

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortPrice);
        break;
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointList();
    this._renderPointsList();
  }

  _renderSort() {
    render(this._pointContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderPointsList() {
    render(this._pointContainer, this._pointListComponent);

    this._renderPoints();
  }

  _renderNoPoints() {
    render(this._pointContainer, this._noTaskComponent);
  }

  _clearPointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderBoard() {
    if (!this._points.length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointsList();
  }
}
