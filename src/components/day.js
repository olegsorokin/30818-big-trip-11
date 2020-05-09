import {createElement} from "../utils";

const createDayTemplate = (timeStamp, index) => {
  const month = new Date(timeStamp).toLocaleDateString(`en-US`, {month: `short`});
  const day = new Date(timeStamp).toLocaleDateString(`en-US`, {day: `numeric`});

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="2019-03-18">${month} ${day}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day {
  constructor(time, index) {
    this._time = time;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._time, this._index);
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
