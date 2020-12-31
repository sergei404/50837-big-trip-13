import SortingPointComponent from '../view/sorting-task.js';
import PointListComponent from '../view/point-list.js';
import PointPresenter from "./point.js";
import NoPointComponent from '../view/no-points.js';
import {render, RenderPosition, remove} from '../utils/render.js';
// import {updateItem} from '../utils/common.js';
import {sotrDays, sortTime, sortPrice} from '../utils/task.js';
import {SortType, UpdateType, UserAction} from "../const.js";

export default class Trip {
  constructor(pointContainer, pointsModel) {
    this._pointContainer = pointContainer;
    this._pointsModel = pointsModel;
    this._currentSortType = SortType.DAY;
    this._pointPresenter = {};

    this._sortComponent = null;

    // this._sortComponent = new SortingPointComponent();
    this._pointListComponent = new PointListComponent();
    this._noTaskComponent = new NoPointComponent();

    // this._handlePointChange = this._handlePointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    // this._points = points.slice().sort(sotrDays);
    // this._sourcedPoints = points.slice().sort(sotrDays);
    render(this._pointContainer, this._pointListComponent);

    this._renderBoard();
  }

  _getPoints() {
    const points = this._pointsModel.getPoints().slice().sort(sotrDays);

    switch (this._currentSortType) {
      case SortType.TIME:
        return points.sort(sortTime);
      case SortType.PRICE:
        return points.sort(sortPrice);
    }

    return points;
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // _handlePointChange(updatedPoint) {
  //   // this._points = updateItem(this._points, updatedPoint);
  //   this._pointPresenter[updatedPoint.id].init(updatedPoint);
  // }

  // _sortPoints(sortType) {
  //   switch (sortType) {
  //     case SortType.TIME:
  //       this._points.sort(sortTime);
  //       break;
  //     case SortType.PRICE:
  //       this._points.sort(sortPrice);
  //       break;
  //     default:
  //       this._points = this._sourcedPoints.slice();
  //   }

  //   this._currentSortType = sortType;
  // }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
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
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача стала favorite)
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    // this._sortPoints(sortType);
    this._currentSortType = sortType;
    // this._clearPointList();
    this._clearBoard();
    //this._renderPointsList();
    this._renderBoard();
  }

  _renderSort() {
    // render(this._pointContainer, this._sortComponent);
    // this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingPointComponent(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  // _renderPointsList() {
  //   render(this._pointContainer, this._pointListComponent);

  //   this._renderPoints();
  // }

  _renderNoPoints() {
    render(this._pointContainer, this._noTaskComponent);
  }

  // _clearPointList() {
  //   Object
  //     .values(this._pointPresenter)
  //     .forEach((presenter) => presenter.destroy());
  //   this._pointPresenter = {};
  // }

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenter)
      .forEach((point) => point.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noTaskComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderBoard() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderPoints(points);
  }
}
