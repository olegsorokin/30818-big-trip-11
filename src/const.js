export const transferTypes = [
  `taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`
];

export const activityTypes = [
  `check-in`, `sightseeing`, `restaurant`
];

export const allTypes = [...transferTypes, ...activityTypes];

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const HIDDEN_CLASS = `visually-hidden`;
