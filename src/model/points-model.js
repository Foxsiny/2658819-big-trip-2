import {mockPoints, mockOffers, mockDestinations} from '../mock/points.js';
import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = mockPoints;
  #destinations = mockDestinations;
  #offers = mockOffers;
  #isLoading = true;

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
  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    // Уведомляем подписчиков об изменении
    this._notify(updateType, update);
  }

  // ДОБАВЛЕНИЕ
  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];
    this._notify(updateType, update);
  }

  // УДАЛЕНИЕ
  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    // При удалении часто передают только тип изменения,
    // но можно передать и update, если подписчику нужно знать, что удалили
    this._notify(updateType, update);
  }

  // Пустой init, так как данные статичны (для совместимости с main.js)
  async init() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.#isLoading = false;
    } catch (err) {
      this.#isLoading = false;
    }
    this._notify(UpdateType.INIT, undefined);
  }
}
