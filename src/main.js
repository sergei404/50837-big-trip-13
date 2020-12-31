import RouteComponent from './view/route';
import SiteMenuComponent from './view/menu';
import FilterComponent from './view/filter';
import TripPresenter from './presenter/trip.js';
import PointsModel from "./model/points.js";
import {render, RenderPosition} from './utils/render.js';
import {generatePoints} from './mock/point.js';
import {generateFilters} from './mock/filter.js';

const CARD_COUNT = 22;
export const points = generatePoints(CARD_COUNT);
const filters = generateFilters();

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElem = document.querySelector(`.trip-main`);
const tripControlsElem = tripMainElem.querySelector(`.trip-controls`);

render(tripMainElem, new RouteComponent(points).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElem.firstChild, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);
render(tripControlsElem, new FilterComponent(filters).getElement());

const tripEventsElem = document.querySelector(`.trip-events`);
// const tripPresenter = new TripPresenter(tripEventsElem);
const tripPresenter = new TripPresenter(tripEventsElem, pointsModel);
// tripPresenter.init(points);
tripPresenter.init();
