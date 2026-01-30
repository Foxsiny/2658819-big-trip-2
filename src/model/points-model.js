import { mockPoints, mockOffers, mockDestinations } from '../mock/points.js';

export default class PointsModel {
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

  get totalPrice() {
    return this.#points.reduce((total, point) => {
      // Используем уже созданный нами метод поиска офферов по типу
      const offersByType = this.getOffersByType(point.type);

      const selectedOffersCost = offersByType
        .filter((o) => point.offers.includes(o.id))
        .reduce((sum, o) => sum + o.price, 0);

      return total + point.basePrice + selectedOffersCost;
    }, 0);
  }

  // Пустой init, так как данные статичны (для совместимости с main.js)
  init() {
    return Promise.resolve();
  }
}
