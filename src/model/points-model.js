
import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #isLoading = true;
  #isError = false;

  constructor({pointsApiService}) {
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

  get isError() {
    return this.#isError;
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => String(point.id) === String(update.id));

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(this.#adaptToServer(update));
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
      return updatedPoint;

    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);

    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(this.#adaptToServer(update));
      const newPoint = this.#adaptToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }


  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#pointsApiService.points,
        this.#pointsApiService.destinations,
        this.#pointsApiService.offers
      ]);
      this.#points = points.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;
      this.#isError = false;

    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#isError = true;

    } finally {
      this.#isLoading = false;
      this._notify(UpdateType.INIT, undefined);
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      id: point.id.toString(),
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptToServer(point) {
    if (!point.destination || !point.dateFrom || !point.dateTo || isNaN(Number(point.basePrice)) || Number(point.basePrice) <= 0) {
      throw new Error('Incomplete or invalid point data');
    }
    const adaptedPoint = {
      ...point,
      'base_price': Number(point.basePrice),
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      'is_favorite': Boolean(point.isFavorite),
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
