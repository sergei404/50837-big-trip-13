import PointComponent from '../view/point.js';
import FormComponent from '../view/form.js';
import {render, replace, remove} from "../utils/render.js";

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
    this._handleFormClose = this._handleFormClose.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

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
    remove(this._formComponent);
  }

  resetView() {
    if (this._mode !== Mode.POINT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() { 
    this._formComponent = new FormComponent(this._point, true);

    this._formComponent.setCloseFormClickHandler(this._handleFormClose);
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);

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
        Object.assign(
            {},
            this._point,
            {
              "is_favorite": !this._point[`is_favorite`]
            }
        )
    );
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }
}
