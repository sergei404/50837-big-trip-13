import AbstractView from "./abstract.js";
import dayjs from 'dayjs';

const getTitleMurkup = (points) => {
  if (points.length) {
    const towns = [...new Set(points.slice().map((point) => point.destination.name))];
    const data = Object.entries(points.slice().reduce((acc, point) => {
      const key = `${point.date_from.getMonth() + 1} ${point.date_from.getDate()}`;
      acc[key] = point.date_from;
      return acc;
    }, {})).sort((prev, next) => prev[1] - next[1]);

    const dateStart = data[0];
    const dateEnd = data[data.length - 1];

    return `<h1 class="trip-info__title">${towns.length >= 3 ? `${towns[0]} &mdash; ... &mdash; ${towns[towns.length - 1]}` : `${towns.join(` &mdash; `)}`}</h1>
    <p class="trip-info__dates">${dayjs(dateStart[1]).format(`MMM D`)} &nbsp;&mdash;&nbsp; ${dateStart[1].getMonth() === dateEnd[1].getMonth() ? dayjs(dateEnd[1]).format(`D`) : dayjs(dateEnd[1]).format(`MMM D`)}</p>`;
  }
  return `<h1 class="trip-info__title">Поговаривают Магадишо в это время года просто восхитителен</h1>`;
};

const createRouteTemplate = (points) => {
  const titleMurkup = getTitleMurkup(points);
  const costValue = points.slice().reduce((acc, point) => acc + (point.price + point.offers.offers.reduce((acc2, offer) => acc2 + offer.price, 0)), 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${titleMurkup}
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${costValue}</span>
      </p>
    </section>`
  );
};

export default class Route extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteTemplate(this._points);
  }
}
