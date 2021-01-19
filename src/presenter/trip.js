import SortingPointComponent from '../view/sorting-task.js';
import PointListComponent from '../view/point-list.js';
import PointPresenter from "./point.js";
import NoPointComponent from '../view/no-points.js';
import PointNewPresenter from "./new-point.js";
import LoadingView from "../view/loading.js";
import {render, RenderPosition, remove} from '../utils/render.js';
import {sotrDays, sortTime, sortPrice} from '../utils/task.js';
import {SortType, UpdateType, UserAction} from "../const.js";
import {filter} from "../utils/filter.js";

export default class Trip {
  constructor(pointContainer, pointsModel, filterModel, api) {
    this._pointContainer = pointContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.DAY;
    this._pointPresenter = {};
    this._isLoading = true;
    this._api = api;
    // this._cities = this._pointsModel.getCities();
    // this._types = this._pointsModel.getTypes();

    this._sortComponent = null;

    this._pointListComponent = new PointListComponent();
    this._noPointComponent = new NoPointComponent();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }

  init() {
    render(this._pointContainer, this._pointListComponent);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._pointListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback, this._pointsModel.getCities(), this._pointsModel.getTypes());
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints().slice().sort(sotrDays);
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort(sortTime);
      case SortType.PRICE:
        return filtredPoints.sort(sortPrice);
    }
    return filtredPoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        //this._pointsModel.updatePoint(updateType, update);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._clearBoard();
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingPointComponent(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._pointContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point, cities, types) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, cities, types);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints(points, cities, types) {
    points.forEach((point) => {
      this._renderPoint(point, cities, types)
    });
  }

  _renderNoPoints() {
    render(this._pointContainer, this._noPointComponent);
  }

  _clearBoard({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((point) => point.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noPointComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(points, this._pointsModel.getCities(), this._pointsModel.getTypes());
  }
}
