import FormComponent from '../view/form.js';
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

  init(callback, model) {
    this._destroyCallback = callback;
    this._cities = model.getCities();
    this._types = model.getTypes();
    if (this._formComponent !== null) {
      return;
    }

    this._formComponent = new FormComponent(this._point, this._cities, this._types, false);
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListElement, this._formComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._formComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._formComponent);
    this._formComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._formComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    if (this._formComponent) {
      const resetFormState = () => {
        this._formComponent.updateData({
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
      };

      this._formComponent.shake(resetFormState);
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
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
