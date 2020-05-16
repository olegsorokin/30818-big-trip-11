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
  return time.toLocaleTimeString(`en-US`, {
    hour: `2-digit`,
    minute: `2-digit`,
    hour12: false
  });
}

export const getDate = (time) => {
  return new Date(time).setHours(0, 0, 0, 0);
};

export const formatDate = (time) => {
  const formattedDate = time.toLocaleDateString(`en-US`, {
    year: `2-digit`,
    month: `2-digit`,
    day: `2-digit`
  });

  return `${formattedDate} ${formatTime(time)}`;
}
