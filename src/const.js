const HIDDEN_CLASS = `visually-hidden`;

const transferTypes = [
  `taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`
];

const activityTypes = [
  `check-in`, `sightseeing`, `restaurant`
];

const typesMap = {
  "taxi": `Taxi`,
  "bus": `Bus`,
  "train": `Train`,
  "ship": `Ship`,
  "transport": `Transport`,
  "drive": `Drive`,
  "flight": `Flight`,
  "check-in": `Check-in`,
  "sightseeing": `Sightseeing`,
  "restaurant": `Restaurant`
};

const allTypes = [...transferTypes, ...activityTypes];

const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export {HIDDEN_CLASS, transferTypes, activityTypes, typesMap, allTypes, FilterType};
