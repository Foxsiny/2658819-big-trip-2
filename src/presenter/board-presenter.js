import { render } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListView from '../view/list-view.js';
import NoPointView from '../view/no-point-view.js';
import { FilterType, SortType } from '../const.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortPointDay, sortPointTime, sortPointPrice } from '../utils/date.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];

  // Хранилище для всех презентеров точек (ID точки -> Презентер точки)
  #pointPresenters = new Map();

  #currentSortType = SortType.DAY; // Храним текущий тип

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#sortPoints(this.#currentSortType);
    this.#renderBoard();
  }

  // Вспомогательный приватный метод для отрисовки всей "доски"
  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderList();
  }

  #renderNoPoints() {
    render(new NoPointView({
      filterType: FilterType.EVERYTHING
    }), this.#boardContainer);
  }

  #renderSort() {
    render(new SortingView({
      currentSortType: this.#currentSortType, // Передаем состояние
      onSortTypeChange: this.#handleSortTypeChange // Передаем обработчик
    }), this.#boardContainer);
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#boardPoints.sort(sortPointTime);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointPrice);
        break;
      default:
        // По умолчанию всегда сортируем по дням
        this.#boardPoints.sort(sortPointDay);
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // Если нажали на ту же кнопку — ничего не делаем
    if (this.#currentSortType === sortType) {
      return;
    }

    // 1. Сортируем точки в массиве
    this.#sortPoints(sortType);
    // 2. Очищаем список
    this.#clearPointList();
    // 3. Рисуем заново
    this.#renderList();
  };

  #renderList() {
    render(this.#listComponent, this.#boardContainer);
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }


  // Приватный метод для отрисовки одной точки
  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listContainer: this.#listComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(
      point,
      this.#pointsModel.destinations, // ПЕРЕДАЕМ ВСЕ ГОРОДА
      this.#pointsModel.offers // ПЕРЕДАЕМ ВСЕ ОФФЕРЫ
    );

    // Сохраняем презентер в Map
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  // Очистка списка (пригодится при сортировке)
  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  // Обработчик изменения точки (например, Favorite)
  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(
      updatedPoint,
      this.#pointsModel.destinations,
      this.#pointsModel.offers
    );
  };

  // Метод, который закрывает все открытые формы
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
