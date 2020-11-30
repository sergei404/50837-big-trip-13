import RouteComponent from './view/route';
import SiteMenuComponent from './view/menu';
import FilterComponent from './view/filter';
import SortingPointComponent from './view/sorting-task';
import PointListComponent from './view/point-list';
import PointComponent from './view/point';
import FormComponent from './view/form';
import NoPointComponent from './view/no-points.js';
import {render} from './utils';
import {generatePoints} from './mock/point.js';
import {generateFilters} from './mock/filter.js';

const CARD_COUNT = 22;
const points = generatePoints(CARD_COUNT);
const filters = generateFilters();

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointComponent(point);
  const formComponent = new FormComponent(point, true);

  const replacePointToForm = () => {
    pointListElement.replaceChild(formComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), formComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.code === `Escape` || evt.code === `Esc`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  formComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  formComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointListElement, pointComponent.getElement());
};

const tripMainElem = document.querySelector(`.trip-main`);
const tripControlsElem = tripMainElem.querySelector(`.trip-controls`);

render(tripMainElem, new RouteComponent(points).getElement(), `afterbegin`);
render(tripControlsElem.children[0], new SiteMenuComponent().getElement(), `afterend`);
render(tripControlsElem, new FilterComponent(filters).getElement());

const tripEventsElem = document.querySelector(`.trip-events`);

if (!points.length) {
  render(tripEventsElem, new NoPointComponent().getElement());
} else {
  render(tripEventsElem, new SortingPointComponent().getElement());
}

const cardList = new PointListComponent();
render(tripEventsElem, cardList.getElement());

const listPoints = tripEventsElem.querySelector(`.trip-events__list`);

points.slice().forEach((point) => renderPoint(listPoints, point));
