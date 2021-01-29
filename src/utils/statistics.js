import dayjs from 'dayjs';

const getTypes = (points) => {
  return [...new Set(points.map((point) => point.type))]
}

const eventsByType = (points, type) => {
  return points.filter((point) => point.type === type);
}

const getSum = (acc, val) => {
  return acc + val.basePrice;
}

const getDurations = (acc, val) => {
  return acc + dayjs(val.dateTo).diff(val.dateFrom);
}

const reduced = (points, reducer) => {
  return points.reduce(reducer, 0)
}


const divideCostsByTypes = (points) => {
  return getTypes(points)
    .map((type) => [type, reduced(eventsByType(points, type), getSum)])
    .sort(([, priceA], [, priceB]) => priceB - priceA);
};

const divideByTypes = (points) => {
  return getTypes(points)
    .map((type) => [type, eventsByType(points, type).length])
    .sort(([, countA], [, countB]) => countB - countA);
};

const divideDurationsByTypes = (points) => {
  return getTypes(points)
    .map((type) => {
      const sum = reduced(eventsByType(points, type), getDurations);
      return [type, dayjs(sum).hour()];
    })
    .sort(([, durationA], [, durationB]) => durationB - durationA);
};


export {divideCostsByTypes, divideByTypes, divideDurationsByTypes};

