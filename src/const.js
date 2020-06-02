export const transferTypes = [
  `taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`
];

export const activityTypes = [
  `check-in`, `sightseeing`, `restaurant`
];

export const typesMap = {
  taxi: `Taxi`,
  bus: `Bus`,
  train: `Train`,
  ship: `Ship`,
  transport: `Transport`,
  drive: `Drive`,
  flight: `Flight`,
  'check-in': `Check-in`,
  sightseeing: `Sightseeing`,
  restaurant: `Restaurant`
}

export const allTypes = [...transferTypes, ...activityTypes];

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const HIDDEN_CLASS = `visually-hidden`;
