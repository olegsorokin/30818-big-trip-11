export const createDayTemplate = (timeStamp, index) => {
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
