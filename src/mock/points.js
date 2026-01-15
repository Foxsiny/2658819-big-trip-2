import {getRandomInteger, getRandomArrayElement} from '../utils.js';
import { POINT_TYPES, DESTINATION_NAMES } from '../const.js';

// 1. СТРУКТУРА ПУНКТА НАЗНАЧЕНИЯ (Destination)
const mockDestinations = DESTINATION_NAMES.map((name, index) => ({
  id: `dest-${index + 1}`, // Генерируем ID на основе индекса
  name: name, // Берем имя из вашей константы
  description: `${name} is a beautiful city...`,
  pictures: Array.from({length: 4}, () => ({
    src: `22.objects.htmlacademy.pro/${getRandomInteger(1, 15)}.jpg`,
    description: `${name} parliament building`
  }))
}));

// 2. СТРУКТУРА (Offers)
const mockOffers = POINT_TYPES.map((type) => ({
  type,
  offers: Array.from({length: getRandomInteger(0, 3)}, (iter, index) => ({
    id: `offer-${type}-${index + 1}`,
    title: `Upgrade to ${type} ${index + 1}`,
    price: getRandomInteger(20, 150)
  }))
}));

// 3. СТРУКТУРА ТОЧКИ МАРШРУТА (Point)
const getRandomPoint = () => {
  const type = getRandomArrayElement(POINT_TYPES);
  const destination = getRandomArrayElement(mockDestinations);

  // Находим доступные офферы для выбранного типа
  const offersByType = mockOffers.find((offer) => offer.type === type);

  // Случайно выбираем несколько ID офферов из доступных для этого типа
  const selectedOffers = offersByType.offers
    .slice(0, getRandomInteger(0, offersByType.offers.length))
    .map((offer) => offer.id);

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(100, 1500),
    dateFrom: '2025-12-23T12:00:00.000Z',
    dateTo: '2025-12-24T13:30:00.000Z',
    destination: destination.id, // Связь с дестинейшном по ID
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: selectedOffers, // Список ID выбранных офферов
    type
  };
};

export {getRandomPoint, mockDestinations, mockOffers};
