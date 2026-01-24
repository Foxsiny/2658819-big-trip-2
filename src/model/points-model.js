import { mockPoints, mockOffers, mockDestinations } from '../mock/points.js';

export default class PointsModel {
  // 1. Объявляем приватные поля, но не заполняем их сразу
  #points = mockPoints;
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return [...this.#points];
  }

  get destinations() {
    return [...this.#destinations];
  }

  get offers() {
    return [...this.#offers];
  }

  // Метод поиска для удобства презентера
  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type)?.offers || [];
  }

  // Пустой init, так как данные статичны (для совместимости с main.js)
  init() {
    return Promise.resolve();
  }
}
