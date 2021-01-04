import RouteComponent from './view/route';
import SiteMenuComponent from './view/menu';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from './utils/render.js';
import {generatePoints} from './mock/point.js';

const CARD_COUNT = 22;
export const points = generatePoints(CARD_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripMainElem = document.querySelector(`.trip-main`);
const headerControlsElem = tripMainElem.querySelector(`.trip-main__trip-controls`);
const tripControlsElem = tripMainElem.querySelector(`.trip-controls`);

render(tripMainElem, new RouteComponent(points).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElem.firstChild, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);

const tripEventsElem = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElem, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(headerControlsElem, filterModel, pointsModel);
filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
