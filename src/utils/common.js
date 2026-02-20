const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const calculateTotalPrice = (points, allOffers) => points.reduce((total, point) => {
  const pointSum = point.basePrice;

  const offersByType = allOffers.find((offer) => offer.type === point.type)?.offers || [];

  const selectedOffersSum = offersByType
    .filter((offer) => point.offers.includes(offer.id))
    .reduce((sum, offer) => sum + offer.price, 0);

  return total + pointSum + selectedOffersSum;
}, 0);


export { getRandomInteger, getRandomArrayElement, updateItem, calculateTotalPrice };
