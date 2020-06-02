export default class Destinations {
  constructor(data) {
    this.destinations = data;
  }

  static parseDestinations(data) {
    return new Destinations(data);
  }
}
