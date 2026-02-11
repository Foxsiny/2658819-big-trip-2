import {render, remove} from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListView from '../view/list-view.js';
import NoPointView from '../view/no-point-view.js';
import {FilterType, SortType, UserAction, UpdateType} from '../const.js';
import PointPresenter from './point-presenter.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/date.js';
import {filter} from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #newPointPresenter = null;

  // Хранилище для всех презентеров точек (ID точки -> Презентер точки)
  #pointPresenters = new Map();

  #currentSortType = SortType.DAY; // Храним текущий тип

  #sortComponent = null;
  #noPointComponent = null;

  constructor({boardContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter({
      listContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy // Передадим из main.js
    });
  }

  // Геттер - единственный источник данных для отрисовки
  get points() {
    const filterType = this.#filterModel.filter; // 1. Смотрим какой фильтр выбран
    const points = this.#pointsModel.points; // 2. Берем все точки
    const filteredPoints = filter[filterType](points); // 3. Отсеиваем лишние (Future/Past)

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...filteredPoints].sort(sortPointTime);
      case SortType.PRICE:
        return [...filteredPoints].sort(sortPointPrice);
    }

    return [...filteredPoints].sort(sortPointDay);
  }

  init() {
    this.#renderBoard();
  }

  // Вспомогательный приватный метод для отрисовки всей "доски"
  #renderBoard() {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#listComponent, this.#boardContainer);
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterModel.filter
    });
    render(this.#noPointComponent, this.#boardContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#boardContainer);
  }

  #handleSortTypeChange = (sortType) => {
    // Если нажали на ту же кнопку — ничего не делаем
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  // Приватный метод для отрисовки одной точки
  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(
      point,
      this.#pointsModel.destinations,
      this.#pointsModel.offers
    );

    pointPresenter.init(point, this.#pointsModel.destinations, this.#pointsModel.offers);
    // Сохраняем презентер в Map
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  // Метод, который закрывает все открытые формы
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // Обновляем только одну карточку (в списке)
        this.#pointPresenters.get(data.id).init(data, this.#pointsModel.destinations, this.#pointsModel.offers);
        break;
      case UpdateType.MINOR:
        // Обновляем список (например, при сортировке)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // Обновляем всю доску (например, при фильтрации)
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  // Метод для полной очистки доски
  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  createPoint() {
    // Сбрасываем фильтры и сортировку перед открытием формы (по ТЗ)
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#newPointPresenter.init(this.#pointsModel.destinations, this.#pointsModel.offers);
  }
}
