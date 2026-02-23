import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import BoardPresenter from './board-presenter.js';
import {calculateTotalPrice} from '../utils/common.js';
import {sortPointDay} from '../utils/date.js';
import {UpdateType, FilterType} from '../const.js';

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

    this.#boardPresenter = new BoardPresenter({
      boardContainer: this.#eventsContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      onNewPointDestroy: onNewPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#boardPresenter.init();

    if (this.#pointsModel.isLoading) {
      return;
    }

    this.#renderTripInfo();
  }

  createPoint() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#boardPresenter.createPoint();
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MAJOR) {
      this.init();
    }
    if (updateType === UpdateType.INIT || updateType === UpdateType.MINOR) {
      this.#renderTripInfo();
    }
  };

  #renderTripInfo() {
    const points = this.#pointsModel.points;
    const destinations = this.#pointsModel.destinations;
    const offers = this.#pointsModel.offers;
    const prevTripInfoComponent = this.#tripInfoComponent;

    if (points.length === 0 || destinations.length === 0 || offers.length === 0) {
      if (prevTripInfoComponent) {
        remove(prevTripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const totalCost = calculateTotalPrice(points, offers);

    const sortedPoints = [...points].sort(sortPointDay);

    this.#tripInfoComponent = new TripInfoView({
      points: sortedPoints,
      destinations: destinations,
      totalCost
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }
}
