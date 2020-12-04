import AbstractView from "./abstract.js";

const getPointList = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class PointList extends AbstractView {
  getTemplate() {
    return getPointList();
  }
}
