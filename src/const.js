export const transferTypes = [
  `taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`
];

export const activityTypes = [
  `check-in`, `sightseeing`, `restaurant`
];

export const allTypes = [...transferTypes, ...activityTypes];

export const cities = [
  `Amsterdam`, `Chamonix`, `Geneva`, `Saint Petersburg`
];

export const offersList = [
  {
    type: `luggage`,
    title: `Add luggage`,
    price: 10
  },
  {
    type: `comfort`,
    title: `Switch to comfort class`,
    price: 150
  },
  {
    type: `meal`,
    title: `Add meal`,
    price: 2
  },
  {
    type: `seats`,
    title: `Choose seats`,
    price: 9
  },
  {
    type: `train`,
    title: `Travel by train`,
    price: 40
  }
];

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const HIDDEN_CLASS = `visually-hidden`;
