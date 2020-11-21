import {createRouteTemplate} from './view/route';
import {createMenuTemplate} from './view/menu';
import {createFilterTemplate} from './view/filter';
import {sortingTaskTemplate} from './view/sorting-task';
import {getPointList} from './view/point-list';
import {getPoint} from './view/point';
import {getForm} from './view/form';
import {render} from './utils';
import {generatePoints} from './mock/point.js';
import {generateFilters} from './mock/filter.js';

const CARD_COUNT = 22;
const points = generatePoints(CARD_COUNT);
const filters = generateFilters();

const tripMainElem = document.querySelector(`.trip-main`);
const tripControlsElem = tripMainElem.querySelector(`.trip-controls`);

render(tripMainElem, createRouteTemplate(points), `afterbegin`);
render(tripControlsElem.children[0], createMenuTemplate(), `afterend`);
render(tripControlsElem, createFilterTemplate(filters));

const tripEventsElem = document.querySelector(`.trip-events`);

render(tripEventsElem, sortingTaskTemplate());
render(tripEventsElem, getForm({}, false));
render(tripEventsElem, getPointList());

const listPoints = tripEventsElem.querySelector(`.trip-events__list`);

points.slice().forEach((point) => render(listPoints, getPoint(point)));
listPoints.children[0].innerHTML = ``;
render(listPoints.children[0], getForm(points[0], true));

