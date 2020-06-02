export default class Point {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.startTime = new Date(data.date_from);
    this.endTime = new Date(data.date_to);
    this.price = data.base_price;
    this.offers = data.offers;
    this.city = data.destination.name;
    this.description = data.destination.description || ``;
    this.pictures = data.destination.pictures;
    this.isFavorite = Boolean(data.is_favorite);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "date_from": this.startTime,
      "date_to": this.endTime,
      "base_price": this.price,
      "offers": this.offers,
      "is_favorite": this.isFavorite,
      "destination": {
        "name": this.city,
        "description": this.description,
        "pictures": this.pictures
      }
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
