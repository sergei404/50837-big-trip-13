export const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
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

export const getRandomDate = () => {
  const sing = Math.random() > 0.5 ? 1 : -1;
  const period = 2 * 24 * 60 * 60 * 1000;
  const diffValue = sing * getRandomNumber(0, period);
  const targetDate = Date.now() + diffValue;

  return targetDate;
};
