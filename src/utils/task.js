const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const sortTime = (prev, next) => {
  return (new Date(next.dateTo) - new Date(next.dateFrom)) - (new Date(prev.dateTo) - new Date(prev.dateFrom));
};

export const sortPrice = (prev, next) => {
  return next.basePrice - prev.basePrice;
};

export const sotrDays = (prev, next) => {
  return prev.dateFrom - next.dateFrom;
};
