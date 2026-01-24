import { mockPoints, mockOffers, mockDestinations } from '../mock/points.js';

export default class PointsModel {
  // 1. Объявляем приватные поля, но не заполняем их сразу
  #points = mockPoints;
  #destinations = mockDestinations;
  #offers = mockOffers;

  // 3. Метод для получения всех точек
  // Мы возвращаем копию массива [...], чтобы никто случайно не изменил данные внутри модели
  // Геттер для получения точек
  get points() { return [...this.#points]; }

  // Геттер для получения пунктов назначения
  get destinations() { return [...this.#destinations]; }

  // Геттер для получения офферов
  get offers() { return [...this.#offers]; }

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
