import RouteComponent from './view/route';
import SiteMenuComponent from './view/menu';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import StatisticsComponent from "./view/statistics.js";
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic TjDpyVBdy4dKt9wFzG8Q9By`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripMainElem = document.querySelector(`.trip-main`);
const headerControlsElem = tripMainElem.querySelector(`.trip-main__trip-controls`);
const tripControlsElem = tripMainElem.querySelector(`.trip-controls`);

const pointsModel = new PointsModel();

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuComponent();

const api = new Api(END_POINT, AUTHORIZATION);

// api.getPoints()
//   .then((points) => {
//     pointsModel.setPoints(UpdateType.INIT, points);
//     render(tripMainElem, new RouteComponent(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
//     siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
//     render(tripControlsElem.firstChild, siteMenuComponent.getElement(), RenderPosition.AFTEREND);
//   })
  // .catch(() => {
  //   pointsModel.setPoints(UpdateType.INIT, []);
  //   render(tripMainElem, new RouteComponent(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
  //   siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  //   render(tripControlsElem.firstChild, siteMenuComponent.getElement(), RenderPosition.AFTEREND);
  // });

// const getTowns = () => {
//   const towns = [];
//   api.getValues(`/destinations`)
//   .then((data) => {
//     towns = data;
//   });
//   return towns;
//}
// const towns = api.getValues(`/destinations`)
//   .then((data) => {
//     return data;
//   });

// console.log(towns);

// let types;
// api.getValues(`/offers`)
// .then((data) => {
//   types = data;
// });

//console.log(getTowns());

const tripEventsElem = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElem, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(headerControlsElem, filterModel, pointsModel);

const handlePointNewFormClose = () => {
  newPointAdd.disabled = false;
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsComponent(pointsModel.getPoints());
      render(tripEventsElem, statisticsComponent);
      siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.TABLE}"]`).classList.remove(`trip-tabs__btn--active`);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

filterPresenter.init();
tripPresenter.init();

const newPointAdd = document.querySelector(`.trip-main__event-add-btn`);

newPointAdd.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
  newPointAdd.disabled = true;
});

const init = () => {
  const response = Promise.all([
    api.getPoints(),
    api.getValues(`/destinations`),
    api.getValues(`/offers`),
  ]);

  return response;
}

init().then((res) => {
  pointsModel.setResponse(UpdateType.INIT, res);
  render(tripMainElem, new RouteComponent(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(tripControlsElem.firstChild, siteMenuComponent.getElement(), RenderPosition.AFTEREND);
})
.catch(() => {
  pointsModel.setResponse(UpdateType.INIT, []);
  render(tripMainElem, new RouteComponent(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(tripControlsElem.firstChild, siteMenuComponent.getElement(), RenderPosition.AFTEREND);
});
