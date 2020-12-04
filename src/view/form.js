import {towns, otherOptions, types} from '../const.js';
import {getRandomNumber} from "../utils/common.js";
import AbstractView from "./abstract.js";
import {MIN_PRICE_VALUE, MAX_PRICE_VALUE} from "../mock/point.js";

const createTypeMarkup = (tipes) => {
  return tipes
    .map((el) => {
      return `<div class="event__type-item">
        <input id="event-type-${el.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${el.toLowerCase()}">
       <label class="event__type-label  event__type-label--${el.toLowerCase()}" for="event-type-${el.toLowerCase()}-1">${el}</label>
      </div>`;
    }).join(`\n`);
};


const createDatalistTemplate = (sities) => {
  return sities
    .map((sity) => {
      return `<option value="${sity}"></option>`;
    });
};

const createOffersMarkup = (offers = [], isDrawn) => {

  return otherOptions
    .map((option, index) => {
      let title = option;
      let price = getRandomNumber(MIN_PRICE_VALUE, MAX_PRICE_VALUE);
      let isActive = false;
      if (offers.length > 0 && isDrawn) {
        offers.forEach((offer) => {
          if (offer.title === option) {
            title = offer.title;
            price = offer.price;
            isActive = true;
          }
        });
      }

      let name = index === 1
        ? option.split(` `)[option.split(` `).length - 2]
        : option.split(` `)[option.split(` `).length - 1];

      return `<div class="event__available-offers">
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}"${isActive ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${name}-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`;
    }).join(`\n`);

};

const createEventPhotosMarkup = (pictures) => {
  return pictures
    .map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    }).join(`\n`);
};

const getDestinationMarkup = ({description, pictures = []}) => {
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


const getForm = ({date_from: dateFrom, date_to: dateTo, destination = {}, offers: {offers} = {}, type, price} = {}, isDrawn) => {
  const transferMarkup = createTypeMarkup(types);
  const datalistTemplate = createDatalistTemplate(towns);
  const offersMarkup = createOffersMarkup(offers, isDrawn);
  const destinationMarkup = getDestinationMarkup(destination);
  const buttonClose = getButtonMarkup();

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${isDrawn ? type : `Taxi`}.png" alt="Event type icon">
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
      ${isDrawn ? type : `Taxi`}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isDrawn ? destination.name : ``}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${datalistTemplate}
      </datalist>
    </div>
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${isDrawn ? dateFrom : ``}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${isDrawn ? dateTo : ``}">
    </div>
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${isDrawn ? price : ``}">
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    ${isDrawn ? buttonClose : ``}
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      ${offersMarkup}
    </section>
    ${isDrawn ? destinationMarkup : ``}
  </section>
</form>`;
};

export default class Form extends AbstractView {
  constructor(point, bool) {
    super();
    this._point = point;
    this._bool = bool;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseClickHandler = this._formCloseClickHandler.bind(this);
  }

  getTemplate() {
    return getForm(this._point, this._bool);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _formCloseClickHandler() {
    this._callback.formClick();
  }

  setCloseFormClickHandler(callback) {
    this._callback.formClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseClickHandler);
  }
}

