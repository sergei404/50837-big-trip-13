import PointComponent from '../view/point.js';
import FormComponent from '../view/form.js';
import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  POINT: `POINT`,
  FORM: `FORM`
};

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._formComponent = null;
    this._mode = Mode.POINT;

    this._handlePointClick = this._handlePointClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point, cities, types) {
    this._point = point;
    this._cities = cities;
    this._types = types;

    const prevPointComponent = this._pointComponent;

    this._pointComponent = new PointComponent(point);

    this._pointComponent.setPointClickHandler(this._handlePointClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null) {
      render(this._pointListContainer, this._pointComponent);
      return;
    }

    if (this._mode === Mode.POINT) {
      replace(this._pointComponent, prevPointComponent);
    }

    remove(prevPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    if (this._formComponent) {
      remove(this._formComponent);
    }
  }

  resetView() {
    if (this._mode !== Mode.POINT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    this._formComponent = new FormComponent(this._point, true, this._cities, this._types);

    this._formComponent.setCloseFormClickHandler(this._handleFormClose);
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    replace(this._formComponent, this._pointComponent);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.FORM;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._formComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.POINT;
  }

  _escKeyDownHandler(evt) {
    if (evt.code === `Escape` || evt.code === `Esc`) {
      evt.preventDefault();
      this._formComponent.reset(this._point);
      this._replaceFormToPoint();
      this._formComponent.removeElement();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point
    );
    this._replaceFormToPoint();
  }

  _handlePointClick() {
    this._replacePointToForm();
  }

  _handleFormClose() {
    this._formComponent.reset(this._point);
    this._replaceFormToPoint();
    this._formComponent.removeElement();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }
}
