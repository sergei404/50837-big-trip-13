import dayjs from 'dayjs';
import {types} from "../const.js";

const divideCostsByTypes = (points) => {
  return [...new Set(points.map((point) => point.type))]
    .map((type) => {
      const eventsByType = points.filter((point) => point.type === type);
      const sum = eventsByType.reduce((acc, val) => ({price: acc.price + val.price}));
      return [type, sum.price];
    })
      .sort(([, priceA], [, priceB]) => priceB - priceA);
};

const divideByTypes = (points) => {
  return types
    .map((type) => {
      return [type, points.filter((point) => point.type === type).length];
    })
    .sort(([, countA], [, countB]) => countB - countA);
};

const divideDurationsByTypes = (points) => {
  return [...new Set(points.map((point) => point.type))]
    .map((type) => {
      const eventsByType = points.filter((point) => point.type === type);
      const sum = eventsByType.reduce((acc, val) => (acc + dayjs(val[`date_to`]).diff(val[`date_from`])), 0);
      return [type, dayjs(sum).hour()];
    })
    .sort(([, durationA], [, durationB]) => durationB - durationA);
};


export {divideCostsByTypes, divideByTypes, divideDurationsByTypes};

