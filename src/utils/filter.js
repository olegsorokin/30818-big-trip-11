import {isFuture, isPast} from "./common";
import {FilterType} from "../const";

export const getAllPoints = (points) => {
  return points.slice();
};

export const getFuturePoints = (points) => {
  return points.filter((it) => isFuture(it));
};

export const getPastPoints = (points) => {
  return points.filter((it) => isPast(it));
};

export const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return getAllPoints(points);
    case FilterType.FUTURE:
      return getFuturePoints(points);
    case FilterType.PAST:
      return getPastPoints(points);
  }

  return points;
};
