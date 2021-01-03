import {towns, types} from '../const.js';
import SmartView from "./smart.js";
import {points} from '../main.js';
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
  "date_from": new Date(),
  "date_to": new Date(),
  "price": ``,
  "offers": [],
};

const createTypeMarkup = (tipes) => {
  return tipes
    .map((el) => {
      const elem = el.toLowerCase();
      return `<div class="event__type-item">
        <input id="event-type-${elem}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem}">
       <label class="event__type-label  event__type-label--${elem}" for="event-type-${elem}-1">${el}</label>
      </div>`;
    }).join(`\n`);
};

const createDatalistTemplate = (sities) => {
  return sities
    .map((sity) => {
      return `<option value="${sity}"></option>`;
    });
};

const createOffersMarkup = (offers, isDrawn) => {
  if (isDrawn) {
    return offers.map((offer) => {
      const optionArray = offer.title.split(` `);
      let name = offer.title === `Switch to comfort class`
        ? optionArray[optionArray.length - 2]
        : optionArray[optionArray.length - 1];

      return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}"${offer.isActive ? `checked` : ``}>
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
  const {description, pictures = []} = destination;
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

const getFormTemplate = (data) => {
  const {date_from: dateFrom, date_to: dateTo, destination, offers: {offers}, isDrawn, type, price} = data;
  const transferMarkup = createTypeMarkup(types);
  const datalistTemplate = createDatalistTemplate(towns);
  const offersMarkup = createOffersMarkup(offers, isDrawn);
  const buttonMarkup = getButtonMarkup();
  const destinationMarkup = getDestinationMarkup(destination);

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
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
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
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
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" required>
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
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
  constructor(point = BLANK_EVENT, isDrawn = false) {
    super();
    this._data = Form.parsePointToData(point, isDrawn);
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
    return getFormTemplate(this._data);
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

    if (this._data.date_from) {
      this._datepickerFrom = flatpickr(
          this.getElement().querySelectorAll(`#event-start-time-1`),
          {
            "dateFormat": `d/m/y H:i`,
            "defaultDate": this._data.date_from,
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

    if (this._data.date_to) {
      this._datepickerTo = flatpickr(
          this.getElement().querySelectorAll(`#event-end-time-1`),
          {
            "dateFormat": `d/m/y H:i`,
            "defaultDate": this._data.date_to,
            "minDate": this._data.date_from,
            "enableTime": true,
            "time_24hr": true,
            "onChange": this._dueToDateChangeHandler
          }
      );
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._dueTypeToggleHandler);

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._repeatingPlaceholderHandler);

    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      this.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, this._formCloseClickHandler);
    }

    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._repeatingPriceHandler);

    if (this.getElement().querySelector(`.event__details`)) {
      this.getElement()
        .querySelector(`.event__details`)
        .addEventListener(`change`, this._selectOffersHandler);
    }
  }

  _dueFromDateChangeHandler([userDateFrom]) {
    this.updateData({
      "date_from": userDateFrom
    });
  }

  _dueToDateChangeHandler([userDateTo]) {
    this.updateData({
      "date_to": userDateTo
    });
  }


  _dueTypeToggleHandler({target}) {
    const newOffers = points.slice().find((point) => point.type.toLowerCase() === target.value).offers.offers;

    for (const offer of newOffers) {
      offer.isActive = false;
    }
    this.updateData({
      type: target.value,
      offers: {
        type: target.value,
        offers: newOffers
      },
      isDrawn: true
    });
  }

  _repeatingPlaceholderHandler({target}) {
    const pointName = points.slice().reduce((acc, data) => {
      acc[data.destination.name] = data.destination;
      return acc;
    }, {});

    if (pointName[target.value]) {
      this.updateData({
        destination: {
          description: pointName[target.value][`description`],
          name: target.value,
          pictures: pointName[target.value][`pictures`]
        }
      });
    } else {
      target.setCustomValidity(`Enter the correct value, one from the list,
        ${Object.keys(pointName)}`);
      return;
    }
  }

  _repeatingPriceHandler({target}) {
    if (Number.isFinite(+target.value)) {
      this.updateData({
        price: target.value
      });
    } else {
      target.setCustomValidity(`The value must be a number`);
      return;
    }
  }

  setRepeatingPlaceholderPriceHandler(callback) {
    this._callback.priceHandler = callback;
    this.getElement().querySelector(`#event-price-1`).addEventListener(`change`, this._repeatingPriceHandler);
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

  static parsePointToData(point, isDrawn) {
    return Object.assign(
        {},
        point,
        {
          isDrawn,
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    return data;
  }

  _formCloseClickHandler() {
    this._callback.formClick();
    this.removeElement();
  }

  setCloseFormClickHandler(callback) {
    this._callback.formClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseClickHandler);
  }

  _selectOffersHandler(evt) {
    if (!evt.target.classList.contains(`event__available-offers`)) {
      let update = this._data.offers.offers.slice();
      const subString = evt.target.name.split(`-`)[evt.target.name.split(`-`).length - 1];
      const element = update.find((elem) => elem.title.includes(subString));
      element.isActive = !element.isActive;
    }
  }
}
