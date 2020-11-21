export const createRouteTemplate = (points) => {
  const towns = new Set(points.slice().map((point) => point.destination.name));
  const data = Object.entries(points.slice().reduce((acc, point) => {
    acc[point.date_from.getDate()] = point.date_from;
    return acc;
  }, {}));

  const costValue = points.slice().reduce((acc, point) => acc + (point.price + point.offers.offers.reduce((acc2, offer) => acc2 + offer.price, 0)), 0);
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${[...towns].join(` - `)}</h1>
        <p class="trip-info__dates">${data[0][1].toLocaleString(`en`, {month: `short`})} ${data[0][0]}&nbsp;&mdash;&nbsp;${data[data.length - 1][0]}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${costValue}</span>
      </p>
    </section>`
  );
};
