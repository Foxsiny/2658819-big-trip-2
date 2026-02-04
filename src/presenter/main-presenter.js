import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import BoardPresenter from './board-presenter.js';
import { calculateTotalPrice } from '../utils/common.js';

export default class MainPresenter {
  #tripMainContainer = null;
  #filterContainer = null;
  #eventsContainer = null;
  #pointsModel = null;

  #boardPresenter = null;

  #filters = null;

  constructor({tripMainContainer, filterContainer, eventsContainer, pointsModel, filters}) {
    this.#tripMainContainer = tripMainContainer;
    this.#filterContainer = filterContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filters = filters; // Сохраняем фильтры

    // Создаем BoardPresenter, но пока не запускаем
    this.#boardPresenter = new BoardPresenter({
      boardContainer: this.#eventsContainer,
      pointsModel: this.#pointsModel,
    });
  }

  init() {
    this.#boardPresenter.init();
    this.#renderTripInfo();
    this.#renderFilters();
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

  #renderFilters() {
    // В будущем здесь появится FilterPresenter
    render(new FilterView({
      filters: this.#filters
    }), this.#filterContainer);
  }
}
