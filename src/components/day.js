import AbstractComponent from "./abstract-component";

const createDayInfoMarkup = (timeStamp, index) => {
  if (timeStamp === undefined) {
    return ``;
  }

  const month = new Date(timeStamp).toLocaleDateString(`en-US`, {month: `short`});
  const day = new Date(timeStamp).toLocaleDateString(`en-US`, {day: `numeric`});

  return (
    `<span class="day__counter">${index}</span>
    <time class="day__date" datetime="2019-03-18">${month} ${day}</time>`
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
