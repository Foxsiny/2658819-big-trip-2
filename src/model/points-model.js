import { getRandomPoint, mockOffers, mockDestinations } from '../mock/points.js';

const POINT_COUNT = 5; // Количество точек, которое мы хотим создать

export default class PointsModel {
  // 1. Объявляем приватные поля, но не заполняем их сразу
  #points = [];
  #destinations = [];
  #offers = [];

  // 2. Асинхронный метод для инициализации данных
  async init() {
    try {
      // Имитируем получение данных (Array.from выполняется быстро, но await готовит нас к fetch)
      this.#points = Array.from({ length: POINT_COUNT }, getRandomPoint);
      this.#destinations = mockDestinations;
      this.#offers = mockOffers;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }
  }

  // 3. Метод для получения всех точек
  // Мы возвращаем копию массива [...], чтобы никто случайно не изменил данные внутри модели
  // Геттер для получения точек
  get points() {
    return [...this.#points];
  }

  // Геттер для получения пунктов назначения (нужен для View)
  get destinations() {
    return [...this.#destinations];
  }

  // Геттер для получения офферов (нужен для View)
  get offers() {
    return [...this.#offers];
  }
}

