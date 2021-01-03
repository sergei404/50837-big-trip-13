import {FilterType} from "../const";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter((point) => point[`date_from`] > new Date()),
  [FilterType.PAST]: (points) => points.filter((point) => point[`date_to`] < new Date())
};
