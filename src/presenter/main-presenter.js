import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import BoardPresenter from './board-presenter.js';
import {calculateTotalPrice} from '../utils/common.js';
import {sortPointDay} from '../utils/date.js';
import {UpdateType} from '../const.js';

export default class MainPresenter {
  #tripMainContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #boardPresenter = null;
  #tripInfoComponent = null;

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

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    if (this.#pointsModel.isLoading) { // Если в модели еще идет загрузка
      return; // Просто ничего не рисуем в шапке
    }

    this.#renderTripInfo();
    this.#boardPresenter.init();
  }

  createPoint() {
    this.#boardPresenter.createPoint();
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT || updateType === UpdateType.MAJOR || updateType === UpdateType.MINOR) {
      this.init();
    }
  };

  #renderTripInfo() {
    const points = this.#pointsModel.points;
    const destinations = this.#pointsModel.destinations;
    const offers = this.#pointsModel.offers;
    const prevTripInfoComponent = this.#tripInfoComponent;

    if (points.length === 0) {
      if (prevTripInfoComponent) {
        remove(prevTripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    // Используем чистую функцию из утилит
    const totalCost = calculateTotalPrice(points, offers);

    const sortedPoints = [...points].sort(sortPointDay);

    this.#tripInfoComponent = new TripInfoView({
      points: sortedPoints,
      destinations: destinations,
      totalCost
    });

    // ЛОГИКА ЗАМЕНЫ:
    // Если это первая отрисовка (старого компонента нет)
    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    // Если компонент уже был — заменяем старый на новый
    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }
}
