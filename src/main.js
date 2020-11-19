import {createRouteTemplate} from './view/route';
import {createMenuTemplate} from './view/menu';
import {createFilterTemplate} from './view/filter';
import {sortingTaskTemplate} from './view/sorting-task';
import {getCardList} from './view/card-list';
import {getCard} from './view/card';
import {getForm} from './view/form';
import {render} from './utils';

const CARD_COUNT = 3;

const tripMainElem = document.querySelector(`.trip-main`);
const tripControlsElem = tripMainElem.querySelector(`.trip-controls`);
 
render(tripMainElem, createRouteTemplate(), `afterbegin`);
render(tripControlsElem.children[0], createMenuTemplate(), `beforebegin`);
render(tripControlsElem, createFilterTemplate());

const tripEventsElem = document.querySelector(`.trip-events`);

render(tripEventsElem, sortingTaskTemplate());
render(tripEventsElem, getCardList());

const cardList = tripEventsElem.querySelector(`.trip-events__list`);
render(cardList, getForm());
new Array(CARD_COUNT)
  .fill(` `)
  .forEach(() => render(cardList, getCard()));
