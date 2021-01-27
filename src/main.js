import Route from './view/route';
import SiteMenuComponent from './view/menu';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from "./presenter/filter.js";
import DataModel from "./model/data.js";
import FilterModel from "./model/filter.js";
import StatisticsComponent from "./view/statistics.js";
import {isOnline} from "./utils/common.js";
import {render, RenderPosition, remove, replace} from './utils/render.js';
import {toast} from "./utils/toast/toast.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";


const AUTHORIZATION = `Basic TjD413pyVBdy4dKt9w7FzG8Q9By`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMainElem = document.querySelector(`.trip-main`);
const headerControlsElem = tripMainElem.querySelector(`.trip-main__trip-controls`);
const tripControlsElem = tripMainElem.querySelector(`.trip-controls`);

const dataModel = new DataModel();

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuComponent();

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tripEventsElem = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElem, dataModel, filterModel, apiWithProvider);

const filterPresenter = new FilterPresenter(headerControlsElem, filterModel, dataModel);

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
      statisticsComponent = new StatisticsComponent(dataModel.getPoints());
      render(tripEventsElem, statisticsComponent);
      siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.TABLE}"]`).classList.remove(`trip-tabs__btn--active`);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

let routeComponent = null;

dataModel.addObserver(() => {
  if (routeComponent) {
    const currentRoute = new Route(dataModel);
    replace(currentRoute, routeComponent);
    remove(routeComponent);
    routeComponent = currentRoute;
  }
});

filterPresenter.init();
tripPresenter.init();

const newPointAdd = document.querySelector(`.trip-main__event-add-btn`);

newPointAdd.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  if (!isOnline()) {
    toast(`You can't create new point offline`);
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    return;
  }
  tripPresenter.createPoint(handlePointNewFormClose);
  siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
  newPointAdd.disabled = true;
});

apiWithProvider.getPoints()
  .then((points) => {
    dataModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    dataModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    routeComponent = new Route(dataModel);
    render(tripMainElem, routeComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(tripControlsElem.firstChild, siteMenuComponent.getElement(), RenderPosition.AFTEREND);
  });

apiWithProvider.getValues(`/destinations`)
  .then((cities) => {
    dataModel.setCities(UpdateType.INIT, cities);
  })
  .catch(() => {
    dataModel.setCities(UpdateType.INIT, []);
  });

apiWithProvider.getValues(`/offers`)
  .then((types) => {
    dataModel.setTypes(UpdateType.INIT, types);
  })
  .catch(() => {
    dataModel.setTypes(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
