import dayjs from 'dayjs';

const divideCostsByTypes = (points) => {
  return Object.entries(points
    .reduce((acc, point) => {
      acc[point.type] = (acc[point.type] || 0) + point.basePrice;
      return acc;
    }, {}))
    .sort(([, priceA], [, priceB]) => priceB - priceA);
};

const divideByTypes = (points) => {
  return Object.entries(points
    .reduce((acc, point) => {
      acc[point.type] = (acc[point.type] || 0) + 1;
      return acc;
    }, {}))
    .sort(([, countA], [, countB]) => countB - countA);
};

const divideDurationsByTypes = (points) => {
  return Object.entries(points
    .reduce((acc, point) => {
      acc[point.type] = dayjs((acc[point.type] || 0) + dayjs(point.dateTo).diff(point.dateFrom)).hour();
      return acc;
    }, {}))
    .sort(([, durationA], [, durationB]) => durationB - durationA);
};

export {divideCostsByTypes, divideByTypes, divideDurationsByTypes};
