import {addRandomMinutes, getRandomArrayItem, getRandomIntegerNumber, getRandomTime} from "../utils";
import {cities, offersList, activityTypes, transferTypes} from "../const";

const pointTypes = [...transferTypes, ...activityTypes];
const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomDescription = () => {
  const count = getRandomIntegerNumber(1, 5);
  const descriptionList = descriptionText.match(/\w+[\w\s,]+\./g);

  return new Array(count)
    .fill(``)
    .map(() => getRandomArrayItem(descriptionList))
    .join(` `);
};

const generatePictures = () => {
  const count = getRandomIntegerNumber(1, 5);

  return new Array(count)
    .fill(``)
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

const generateOffers = () => {
  const count = getRandomIntegerNumber(0, 5);
  const offers = new Array(count)
    .fill(``)
    .map(() => getRandomArrayItem(offersList));

  return [...new Set(offers)];
};

const generatePoint = () => {
  const startTime = getRandomTime();

  return {
    type: getRandomArrayItem(pointTypes),
    city: getRandomArrayItem(cities),
    startTime,
    endTime: addRandomMinutes(startTime),
    price: getRandomIntegerNumber(10, 900),
    offers: generateOffers(),
    pictures: generatePictures(),
    description: getRandomDescription(),
    isFavorite: Math.random() > 0.5
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint)
    .sort((a, b) => a.startTime - b.startTime);
};

export {generatePoints};
