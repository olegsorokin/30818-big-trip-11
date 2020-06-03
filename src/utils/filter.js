import {isFuture, isPast} from "./common";
import {FilterType} from "../const";

const getAllPoints = (points) => {
  return points.slice();
};

const getFuturePoints = (points) => {
  return points.filter((it) => isFuture(it.startTime));
};

const getPastPoints = (points) => {
  return points.filter((it) => isPast(it.endTime));
};

const getPointsByFilter = (points, filterType) => {
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

export {getPointsByFilter};
