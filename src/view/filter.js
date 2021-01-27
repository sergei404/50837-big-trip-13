import AbstractView from "./abstract.js";

const createFilterMarkup = (filter, currentFilterType, points) => {
  const {type} = filter;
  const future = !points.slice().filter((point) => new Date(point.dateTo) > new Date()).length && type === `future`;
  const past = !points.slice().filter((point) => new Date(point.dateTo) < new Date()).length && type === `past`;
  const option = future || past;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${type}"
      ${option ? `disabled` : type === currentFilterType ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
};

const createFilterTemplate = (filters, currentFilterType, points) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter, currentFilterType, points)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType, points) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._points = points;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }


  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._points);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
