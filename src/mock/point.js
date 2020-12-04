import {towns, expressions, otherOptions, types} from '../const.js';
import {getRandomDate, getRandomArrayItem, getRandomNumber, shuffle} from "../utils/common.js";
const MIN_NUMBER_SENTENCES_DESCRIPTION = 1;
const MAX_NUMBER_SENTENCES_DESCRIPTION = 3;
const MIN_COUNT_OFFERS = 0;
const MAX_COUNT_OFFERS = 5;
const MIN_COUNT_PHOTO = 1;
const MAX_COUNT_PHOTO = 5;
const MIN_PRICE_VALUE = 15;
const MAX_PRICE_VALUE = 75;
const MIN_OFFERS_PRICE_VALUE = 5;
const MAX_OFFERS_PRICE_VALUE = 50;
const MIN_TIME_PERIOD = 1800000;
const MAX_TIME_PERIOD = 18000000;

const destination = () => {
  return {
    "description": shuffle(expressions.slice()).slice(0, getRandomNumber(MIN_NUMBER_SENTENCES_DESCRIPTION, MAX_NUMBER_SENTENCES_DESCRIPTION)),
    "name": getRandomArrayItem(towns),
    "pictures": new Array(getRandomNumber(MIN_COUNT_PHOTO, MAX_COUNT_PHOTO)).fill(` `).map(() => ({
      "src": `http://picsum.photos/300/150?r=${Math.random()}`,
      "description": getRandomArrayItem(expressions)
    }))
  };
};

const getOffers = () => {
  return new Array(getRandomNumber(MIN_COUNT_OFFERS, MAX_COUNT_OFFERS
  )).fill(` `).map(() => ({
    "title": getRandomArrayItem(otherOptions),
    "price": getRandomNumber(MIN_OFFERS_PRICE_VALUE, MAX_OFFERS_PRICE_VALUE)
  }));
};


const generatePoint = () => {
  const offers = getOffers();
  const type = getRandomArrayItem(types);
  const data = getRandomDate();
  return {
    "base_price": getRandomNumber(800, 2000),
    "date_from": new Date(data),
    "date_to": new Date(data + getRandomNumber(MIN_TIME_PERIOD, MAX_TIME_PERIOD)),
    "destination": destination(),
    "is_favorite": Math.random() > 0.5,
    "offers": {
      "type": type,
      "offers": offers
    },
    "type": type,
    "price": getRandomNumber(MIN_PRICE_VALUE, MAX_PRICE_VALUE)
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint)
    .sort((prev, next) => prev.date_from - next.date_from);
};

export {generatePoint, generatePoints, MIN_PRICE_VALUE, MAX_PRICE_VALUE};
