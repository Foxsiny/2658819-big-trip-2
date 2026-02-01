import { render } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListView from '../view/list-view.js';
import NoPointView from '../view/no-point-view.js'; // Импортируем заглушку
import { FilterType } from '../const.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];

  // Хранилище для всех презентеров точек (ID точки -> Презентер точки)
  #pointPresenters = new Map();

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
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
    render(new SortingView(), this.#boardContainer);
  }

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
      this.#pointsModel.getDestinationById(point.destination),
      this.#pointsModel.getOffersByType(point.type),
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
      this.#pointsModel.getDestinationById(updatedPoint.destination),
      this.#pointsModel.getOffersByType(updatedPoint.type)
    );
  };

  // Метод, который закрывает все открытые формы
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
