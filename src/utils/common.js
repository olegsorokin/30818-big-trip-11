import moment from "moment";

const formatTime = (time) => {
  return moment(time).format(`HH:mm`);
};

const formatDate = (time) => {
  return moment(time).format(`DD/MM/YY HH:mm`);
};

const formatShortDate = (time) => {
  return moment(time).format(`MMM DD`);
};

const formatDiff = (start, end) => {
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

const getDuration = (start, end) => {
  const startTime = moment(start);
  const endTime = moment(end);
  const duration = moment.duration(endTime.diff(startTime));

  return duration.asDays();
};

const formatISO = (time) => {
  return moment(time).toISOString();
};

const getDayTimeStamp = (time) => {
  return moment(time).startOf(`day`).valueOf();
};

const isFuture = (date) => {
  return moment().isBefore(date);
};

const isPast = (date) => {
  return moment().isAfter(date);
};

const parseDate = (date) => {
  return moment(date, `DD/MM/YY hh:mm`).toISOString();
};

export {formatTime, formatDate, formatShortDate, formatDiff, getDuration, formatISO, getDayTimeStamp, isFuture, isPast, parseDate};
