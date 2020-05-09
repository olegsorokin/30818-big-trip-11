import {createElement} from "../utils";

const createCitiesList = (points) => {
  if (points.length <= 3) {
    return points
      .map((point) => point.city)
      .join(` &mdash; `);
  }

  const lastPointIndex = points.length - 1;
  return `${points[0].city} &mdash; ... &mdash; ${points[lastPointIndex].city}`;
};

const createDatesList = (points) => {
  const lastPointIndex = points.length - 1;
  const startDate = points[0].startTime;
  const endDate = points[lastPointIndex].startTime;
  const startMonth = startDate.toLocaleDateString(`en-US`, {month: `short`});
  const startDay = startDate.getDate();
  const endMonth = endDate.toLocaleDateString(`en-US`, {month: `short`});
  const endDay = endDate.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
  }

  return `${startMonth} ${startDay}&nbsp;&mdash;&nbsp;${endMonth} ${endDay}`;
};

const calculateTotalCost = (points) => {
  return points.reduce((acc, it) => acc + it.price, 0);
};

const createTripInfoTemplate = (points) => {
  const citiesList = createCitiesList(points);
  const datesList = createDatesList(points);
  const totalCost = calculateTotalCost(points);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${citiesList}</h1>

        <p class="trip-info__dates">${datesList}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
