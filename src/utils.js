// export const RenderPosition = {
//   AFTERBEGIN: `afterbegin`,
//   BEFOREEND: `beforeend`,
//   BEFOREBEGIN: `beforebegin`,
//   AFTEREND: `afterend`
// };

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// export const render = (container, element, place = RenderPosition.BEFOREEND) => {
//   switch (place) {
//     case RenderPosition.AFTERBEGIN:
//       container.prepend(element);
//       break;
//     case RenderPosition.BEFOREEND:
//       container.append(element);
//       break;
//     case RenderPosition.BEFOREBEGIN:
//       container.before(element);
//       break;
//     case RenderPosition.AFTEREND:
//       container.after(element);
//       break;
//   }
// };

export const render = (container, element, place = `beforeend`) => {
  switch (true) {
    case place === `afterbegin`:
      container.prepend(element);
      break;
    case place === `beforeend`:
      container.append(element);
      break;
    case place === `beforebegin`:
      container.before(element);
      break;
    case place === `afterend`:
      container.after(element);
      break;
  }
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const getRandomDate = () => {
  const sing = Math.random() > 0.5 ? 1 : -1;
  const period = 2 * 24 * 60 * 60 * 1000;
  const diffValue = sing * getRandomNumber(0, period);
  const targetDate = Date.now() + diffValue;

  return targetDate;
};

export const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max + 1 - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length - 1);

  return array[randomIndex];
};

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[rand]] = [arr[rand], arr[i]];
  }
  return arr;
}
