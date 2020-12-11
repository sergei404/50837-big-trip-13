const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const sortTime = (prev, next) => {
  return prev.date_from - next.date_from;
};

export const sortPrice = (prev, next) => {
  return next.price - prev.price;
};

export const sotrDay = (prev, next) => {
  return new Date(prev[1]) - new Date(next[1]);
};
