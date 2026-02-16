
import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #pointsApiService = null; // Поле для сервиса
  #points = [];
  #destinations = [];
  #offers = [];
  #isLoading = true;

  constructor({pointsApiService}) { // Принимаем сервис из main.js
    super();
    this.#pointsApiService = pointsApiService;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  // ОБНОВЛЕНИЕ
  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      // 1. Отправляем адаптированные данные на сервер
      const response = await this.#pointsApiService.updatePoint(
        this.#adaptToServer(update)
      );

      // 2. Адаптируем ответ сервера обратно под наш формат
      const updatedPoint = this.#adaptToClient(response);

      // 3. Обновляем локальный массив данных
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      // 4. Уведомляем презентеры
      this._notify(updateType, updatedPoint);
    } catch(err) {
      // Если сервер вернул ошибку, пробрасываем её дальше для эффекта "тряски"
      throw new Error('Can\'t update point');
    }
  }

  // ДОБАВЛЕНИЕ
  async addPoint(updateType, update) {
    try {
      // 1. Отправляем на сервер адаптированную точку
      const response = await this.#pointsApiService.addPoint(this.#adaptToServer(update));
      // 2. Получаем ответ и адаптируем его обратно (там теперь есть настоящий ID)
      const newPoint = this.#adaptToClient(response);

      // 3. Обновляем локальный массив
      this.#points = [newPoint, ...this.#points];

      // 4. Уведомляем систему
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  // УДАЛЕНИЕ
  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      // 1. Даем команду серверу на удаление
      await this.#pointsApiService.deletePoint(update);

      // 2. Если сервер подтвердил (не выкинул ошибку), удаляем локально
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      // 3. Уведомляем об успехе (передаем null, так как объекта больше нет)
      this._notify(updateType, null);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  // Пустой init, так как данные статичны (для совместимости с main.js)
  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient); // Адаптируем каждую точку

      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;

      this.#isLoading = false;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#isLoading = false;
    }
    this._notify(UpdateType.INIT, undefined);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'], // Превращаем строку в объект даты
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    // Удаляем лишние серверные ключи, чтобы не путаться
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      'is_favorite': Boolean(point.isFavorite),
    };

    // Удаляем наши внутренние CamelCase ключи
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
