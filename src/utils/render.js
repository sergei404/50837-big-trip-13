export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
