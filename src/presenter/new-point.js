import FormComponent from '../view/form.js';
import {generateId} from "../mock/point.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {
  constructor(pointListElement, changeData) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;

    this._formComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._formComponent !== null) {
      return;
    }

    this._formComponent = new FormComponent();
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListElement, this._formComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._formComponent === null) {
      return;
    }

    remove(this._formComponent);
    this._formComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        // Пока у нас нет сервера, который бы после сохранения
        // выдывал честный id задачи, нам нужно позаботиться об этом самим
        Object.assign({id: generateId()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
