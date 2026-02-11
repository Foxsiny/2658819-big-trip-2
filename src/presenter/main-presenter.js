import { render } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import BoardPresenter from './board-presenter.js';
import { calculateTotalPrice } from '../utils/common.js';

export default class MainPresenter {
  #tripMainContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #boardPresenter = null;

  constructor({tripMainContainer, eventsContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#eventsContainer = eventsContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    // Создаем BoardPresenter, но пока не запускаем
    this.#boardPresenter = new BoardPresenter({
      boardContainer: this.#eventsContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      onNewPointDestroy: onNewPointDestroy,
    });
  }

  init() {
    this.#boardPresenter.init();
    this.#renderTripInfo();
  }

  createPoint() {
    this.#boardPresenter.createPoint();
  }

  #renderTripInfo() {
    const points = this.#pointsModel.points;
    const destinations = this.#pointsModel.destinations;
    const offers = this.#pointsModel.offers;

    if (points.length === 0) {
      return;
    }

    // Используем чистую функцию из утилит
    const totalCost = calculateTotalPrice(points, offers);

    render(new TripInfoView({
      points: points,
      destinations: destinations,
      totalCost
    }), this.#tripMainContainer, 'afterbegin');
  }
}
