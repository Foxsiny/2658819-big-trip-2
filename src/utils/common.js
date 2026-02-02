const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);


export { getRandomInteger, getRandomArrayElement, updateItem };
