const transferTypes = [
  `taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`
];

const activityTypes = [
  `check-in`, `sightseeing`, `restaurant`
];

const cities = [
  `Amsterdam`, `Chamonix`, `Geneva`, `Saint Petersburg`
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
  },
  {
    type: `train`,
    title: `Travel by train`,
    price: 40
  }
];

export {cities, offers, activityTypes, transferTypes};
