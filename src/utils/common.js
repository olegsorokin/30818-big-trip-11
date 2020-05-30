import moment from "moment";

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomTime = () => {
  const MILLISECONDS_IN_WEEK = 604800000;
  const currentTime = Date.now();
  const randomDate = currentTime + Math.floor(Math.random() * MILLISECONDS_IN_WEEK);

  return new Date(randomDate);
};

export const addRandomMinutes = (time) => {
  const MILLISECONDS_IN_2_DAYS = 172800000;
  const randomMillisecondsCount = Math.floor(Math.random() * MILLISECONDS_IN_2_DAYS);
  const randomTime = time.getTime() + randomMillisecondsCount;

  return new Date(randomTime);
};

export const formatTime = (time) => {
  return moment(time).format(`HH:mm`);
};

export const formatDate = (time) => {
  return moment(time).format(`DD/MM/YY HH:mm`);
};

export const formatShortDate = (time) => {
  return moment(time).format(`MMM DD`);
};

export const formatDiff = (start, end) => {
  const diff = moment(end).diff(moment(start));
  const minutes = moment.duration(diff).minutes();
  const hours = moment.duration(diff).hours();
  const days = moment.duration(diff).days();

  if (days === 0) {
    if (hours === 0) {
      return moment(`${minutes}`, `m`).format(`mm[M]`);
    }

    return moment(`${hours} ${minutes}`, `H m`).format(`HH[H] mm[M]`);
  }

  return moment(`${days} ${hours} ${minutes}`, `D H m`).format(`DD[D] HH[H] mm[M]`);
};

export const formatISO = (time) => {
  return moment(time).toISOString();
};

export const getDayTimeStamp = (time) => {
  return moment(time).startOf(`day`).valueOf();
};

export const isFuture = (date) => {
  return moment().isAfter(date);
};

export const isPast = (date) => {
  return moment().isBefore(date);
};

export const parseDate = (date) => {
  return moment(date, `DD/MM/YY hh:mm`).toDate();
};
