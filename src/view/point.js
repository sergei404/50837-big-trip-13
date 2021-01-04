import AbstractView from "./abstract.js";
import dayjs from 'dayjs';

const createOfferMarkup = ({title, price}) => {
  return `
      <li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>
    `;
};

const getPoint = (point) => {
  const {
    date_from: dateFrom,
    date_to: dateTo,
    is_favorite: isFavorite,
    destination,
    offers: {offers},
    type,
    price
  } = point;

  const offersMarkup = offers
    .filter((offer) => offer.isActive)
    .map((it) => createOfferMarkup(it)).join(`\n`);
  const day = dayjs(dateTo).diff(dayjs(dateFrom), `d`);
  const hours = dayjs(dateTo).diff(dayjs(dateFrom), `h`);
  const minute = dayjs(dateTo).diff(dayjs(dateFrom), `m`);


  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${dayjs(dateFrom).format(`MMM D`)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${new Date(dateFrom)}">${dayjs(dateFrom).format(`hh:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${new Date(dateTo)
}">${dayjs(dateTo).format(`hh:mm`)}</time>
          </p>
          <p class="event__duration">${day > 0 ? day + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minute % 60 + `M`}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._pointClickHandler = this._pointClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return getPoint(this._point);
  }

  _pointClickHandler() {
    this._callback.pointClick();
  }

  setPointClickHandler(callback) {
    this._callback.pointClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._pointClickHandler);
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}

