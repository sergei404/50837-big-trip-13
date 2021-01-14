import dayjs from 'dayjs';

const divideCostsByTypes = (points) => {
  return [...new Set(points.map((point) => point.type))]
    .map((type) => {
      const eventsByType = points.filter((point) => point.type === type);
      const sum = eventsByType.reduce((acc, val) => (acc + val.basePrice), 0);
      return [type, sum];
    })
      .sort(([, priceA], [, priceB]) => priceB - priceA);
};

const divideByTypes = (points) => {
  return [...new Set(points.map((point) => point.type))]
    .map((type) => {
      return [type, points.filter((point) => point.type === type).length];
    })
    .sort(([, countA], [, countB]) => countB - countA);
};

const divideDurationsByTypes = (points) => {
  return [...new Set(points.map((point) => point.type))]
    .map((type) => {
      const eventsByType = points.filter((point) => point.type === type);
      const sum = eventsByType.reduce((acc, val) => (acc + dayjs(val.dateTo).diff(val.dateFrom)), 0);
      return [type, dayjs(sum).hour()];
    })
    .sort(([, durationA], [, durationB]) => durationB - durationA);
};


export {divideCostsByTypes, divideByTypes, divideDurationsByTypes};

