import {towns, expressions, otherOptions, types} from '../const.js';
import {getRandomDate, getRandomArrayItem, getRandomNumber, shuffle} from "../utils.js";
const COUNT_PHOTO = 5;

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const destination = () => {
  return {
    "description": shuffle(expressions.slice()).slice(0, getRandomNumber(1, 3)),
    "name": getRandomArrayItem(towns),
    "pictures": new Array(getRandomNumber(1, COUNT_PHOTO)).fill(` `).map(() => ({
      "src": `http://picsum.photos/300/150?r=${Math.random()}`,
      "description": getRandomArrayItem(expressions)
    }))
  };
};

const getOffers = () => {
  return new Array(getRandomNumber(0, 5)).fill(` `).map(() => ({
    "title": getRandomArrayItem(otherOptions),
    "price": getRandomNumber(2, 50)
  }));
};


const generatePoint = () => {
  const offers = getOffers();
  const type = getRandomArrayItem(types);
  const data = getRandomDate();
  return {
    "base_price": getRandomNumber(800, 2000),
    "date_from": new Date(data),
    "date_to": new Date(data + getRandomNumber(1800000, 18000000)),
    "destination": destination(),
    "id": generateId(),
    "is_favorite": Math.random() > 0.5,
    "offers": {
      "type": type,
      "offers": offers
    },
    "type": type,
    "price": getRandomNumber(10, 100)
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint)
    .sort((prev, next) => prev.date_from - next.date_from);
};

export {generatePoint, generatePoints};
