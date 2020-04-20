const transferTypes = [
  `taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`
];

const placeTypes = [
  `check-in`, `sightseeing`, `restaurant`
];

const cities = [
  `Amsterdam`, `Chamonix`, `Geneva`
];

const offers = [
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
  }
];

export {cities, offers, placeTypes, transferTypes};
