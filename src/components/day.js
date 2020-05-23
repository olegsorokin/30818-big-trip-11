import AbstractComponent from "./abstract-component";
import {formatISO, formatShortDate} from "../utils/common";

const createDayInfoMarkup = (timeStamp, index) => {
  if (timeStamp === undefined) {
    return ``;
  }

  return (
    `<span class="day__counter">${index}</span>
    <time class="day__date" datetime="${formatISO(timeStamp)}">${formatShortDate(timeStamp)}</time>`
  );
};

const createDayTemplate = (timeStamp, index) => {
  const dayInfoMarkup = createDayInfoMarkup(timeStamp, index);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoMarkup}
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(time, index) {
    super();
    this._time = time;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._time, this._index);
  }
}
