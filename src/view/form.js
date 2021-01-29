import SmartView from "./smart.js";
import dayjs from 'dayjs';
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/dark.css";

const BLANK_EVENT = {
  "type": `flight`,
  "destination": {
    "name": ``,
    "description": ``,
    "pictures": []
  },
  "dateFrom": new Date(),
  "dateTo": new Date(),
  "basePrice": ``,
  "offers": []
};

const createTypeMarkup = (tipes) => {
  return tipes
    .map((el) => {
      const title = el.type[0].toUpperCase() + el.type.slice(1);
      return `<div class="event__type-item">
        <input id="event-type-${el.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${el.type}">
       <label class="event__type-label  event__type-label--${el.type}" for="event-type-${el.type}-1">${title}</label>
      </div>`;
    }).join(`\n`);
};

const createDatalistTemplate = (cities) => {
  return cities
    .map((city) => {
      return `<option value="${city.name}"></option>`;
    });
};

const createOffersMarkup = (offers) => {
  if (offers.length) {
    return offers.map((offer) => {
      const name = offer.title.toLowerCase().split(` `).join(`-`);

      return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${offer.isActive ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${name}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`;
    }).join(`\n`);
  }
  return ``;
};

const createEventPhotosMarkup = (pictures) => {
  return pictures
    .map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    }).join(`\n`);
};

const getDestinationMarkup = (destination) => {
  const {description, pictures} = destination;
  const eventPhotosMarkup = createEventPhotosMarkup(pictures);

  return `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${eventPhotosMarkup}
    </div>
  </div>
</section>`;
};

const getButtonMarkup = () => {
  return `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
};

const getFormTemplate = (data, cities, types) => {
  const {dateFrom, dateTo, destination, type, offers, isDrawn, basePrice, isDisabled, isSaving,
    isDeleting} = data;

  const transferMarkup = createTypeMarkup(types);
  const datalistTemplate = createDatalistTemplate(cities);
  const offersMarkup = createOffersMarkup(offers, isDrawn);
  const buttonMarkup = getButtonMarkup();
  const destinationMarkup = getDestinationMarkup(destination);
  const cancelOrDelete = isDrawn ? `Delete` : `Cancel`;

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${transferMarkup}
        </fieldset>
      </div>
    </div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" required>
      <datalist id="destination-list-1">
        ${datalistTemplate}
      </datalist>
    </div>
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format(`D/MM/YY hh:mm`)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format(`D/MM/YY hh:mm`)}">
    </div>
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" required>
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : cancelOrDelete}</button>
    ${isDrawn ? buttonMarkup : ``}
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>
    ${destinationMarkup}
  </section>
</form>`;
};

export default class Form extends SmartView {
  constructor(point = BLANK_EVENT, cities, types, isDrawn) {
    super();
    this._data = Form.parsePointToData(point, isDrawn);
    this._cities = cities;
    this._types = types;
    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formCloseClickHandler = this._formCloseClickHandler.bind(this);

    this._dueFromDateChangeHandler = this._dueFromDateChangeHandler.bind(this);
    this._dueToDateChangeHandler = this._dueToDateChangeHandler.bind(this);

    this._dueTypeToggleHandler = this._dueTypeToggleHandler.bind(this);
    this._repeatingPlaceholderHandler = this._repeatingPlaceholderHandler.bind(this);

    this._repeatingPriceHandler = this._repeatingPriceHandler.bind(this);
    this._selectOffersHandler = this._selectOffersHandler.bind(this);

    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
  }

  reset(data) {
    this.updateData(
        Form.parseDataToPoint(data)
    );
  }

  getTemplate() {
    return getFormTemplate(this._data, this._cities, this._types);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setFromDatepicker();
    this._setToDatepicker();
  }

  _setFromDatepicker() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._data.dateFrom) {
      this._datepickerFrom = flatpickr(
          this.getElement().querySelectorAll(`#event-start-time-1`),
          {
            "dateFormat": `d/m/y H:i`,
            "defaultDate": this._data.dateFrom,
            "enableTime": true,
            "time_24hr": true,
            "onChange": this._dueFromDateChangeHandler
          }
      );
    }
  }

  _setToDatepicker() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    if (this._data.dateTo) {
      this._datepickerTo = flatpickr(
          this.getElement().querySelectorAll(`#event-end-time-1`),
          {
            "dateFormat": `d/m/y H:i`,
            "defaultDate": this._data.dateTo,
            "minDate": this._data.dateFrom,
            "enableTime": true,
            "time_24hr": true,
            "onChange": this._dueToDateChangeHandler
          }
      );
    }
  }

  _dueFromDateChangeHandler([userDateFrom]) {
    this.updateData({
      dateFrom: userDateFrom
    });
  }

  _dueToDateChangeHandler([userDateTo]) {
    this.updateData({
      dateTo: userDateTo
    });
  }

  _setInnerHandlers() {
    const elem = this.getElement();

    this._getEventHandler(`.event__type-list`, `change`, this._dueTypeToggleHandler);
    this._getEventHandler(`#event-destination-1`, `change`, this._repeatingPlaceholderHandler);

    if (elem.querySelector(`.event__rollup-btn`)) {
      this._getEventHandler(`.event__rollup-btn`, `click`, this._formCloseClickHandler);
    }

    this._getEventHandler(`.event__input--price`, `change`, this._repeatingPriceHandler);

    if (elem.querySelector(`.event__details`)) {
      this._getEventHandler(`.event__details`, `change`, this._selectOffersHandler);
    }
  }

  _getEventHandler(selector, action, callback) {
    this.getElement().querySelector(selector)
      .addEventListener(action, callback);
  }

  _dueTypeToggleHandler(evt) {
    const newOffers = this._types.find((elem) => elem.type.toLowerCase() === evt.target.value).offers;
    this.updateData({
      type: evt.target.value,
      offers: newOffers,
    });
  }

  _repeatingPlaceholderHandler(evt) {
    const pointName = this._cities.reduce((acc, data) => {
      acc[data.name] = data;
      return acc;
    }, {});

    if (pointName[evt.target.value]) {
      this.updateData({
        destination: pointName[evt.target.value]
      });
    }
    evt.target.setCustomValidity(`Enter the correct value, one from the list, ${Object.keys(pointName)}`);
  }

  _repeatingPriceHandler({target}) {
    if (Number.isFinite(+target.value)) {
      this.updateData({
        basePrice: +target.value
      });
    }
    target.setCustomValidity(`The value must be a number`);
  }

  _selectOffersHandler(evt) {
    const update = this._data.offers.slice();
    const element = update.find((elem) => evt.target.name.includes(elem.title.toLowerCase().split(` `).join(`-`)));

    element.isActive = !element.isActive;
    this.updateData({
      offers: update
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(Form.parsePointToData(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(Form.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _formCloseClickHandler() {
    this._callback.formClick();
    this.removeElement();
  }

  setCloseFormClickHandler(callback) {
    this._callback.formClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseClickHandler);
  }

  static parsePointToData(point, isDrawn) {
    return Object.assign(
        {},
        point,
        {
          isDrawn,
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
          offers: JSON.parse(JSON.stringify(point.offers))
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }
}
