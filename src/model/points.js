import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._cities = [];
    this._types = [];
  }

  setResponse(updateType, res) {
    const [points, cities, types] = res;
    this._points = points.slice();
    this._sities = cities.slice();
    this._types = types.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  getCities() {
    return this._sities;
  }

  getTypes() {
    return this._types;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          basePrice: point.base_price,
          dateFrom: point.date_from,
          dateTo: point.date_to,
          isFavorite: point.is_favorite,

        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    if (!point.isDrawn) {
      point.isFavorite = false;
    }

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.basePrice,
          "date_from": point.dateFrom,
          "date_to": point.dateTo,
          "is_favorite": point.isFavorite,
        }
    );

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.isDisabled;
    delete adaptedPoint.isDrawn;
    delete adaptedPoint.isDeleting;
    delete adaptedPoint.isSaving;

    return adaptedPoint;
  }
}
