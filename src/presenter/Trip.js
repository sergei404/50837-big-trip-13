import SortingPointComponent from '../view/sorting-task.js';
import PointListComponent from '../view/point-list.js';
import PointPresenter from "./point.js";
import NoPointComponent from '../view/no-points.js';
import {render} from '../utils/render.js';
import {updateItem} from "../utils/common.js";

export default class Trip {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;
    this._pointPresenter = {};

    this._sortComponent = new SortingPointComponent();
    this._pointListComponent = new PointListComponent();
    this._noTaskComponent = new NoPointComponent();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();

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

  _renderSort() {
    render(this._pointContainer, this._sortComponent);
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

  _clearTaskList() {
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
