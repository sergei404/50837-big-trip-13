import AbstractView from "./abstract.js";

const getTitleMurkup = (points) => {
  if (points.length) {
    const towns = new Set(points.slice().map((point) => point.destination.name));
    const data = Object.entries(points.slice().reduce((acc, point) => {
      acc[`${point.date_from.getMonth() + 1} ${point.date_from.getDate() + 1}`] = point.date_from;
      return acc;
    }, {}));

    return `<h1 class="trip-info__title">${[...towns].join(` &mdash; `)}</h1>
    <p class="trip-info__dates">${data[0][1].toLocaleString(`en`, {month: `short`})} ${data[0][0].split(` `)[1]} &nbsp;&mdash;&nbsp;${data[0][1].toLocaleString(`en`, {month: `short`}) === data[data.length - 1][1].toLocaleString(`en`, {month: `short`}) ? `` : data[data.length - 1][1].toLocaleString(`en`, {month: `short`})} ${data[data.length - 1][0].split(` `)[1]}</p>`;
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
