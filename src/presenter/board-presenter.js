import {render} from '../render.js';
import SortingView from '../view/sorting-view.js';
import ListView from '../view/list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointAddView from '../view/point-add-view.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];
  #boardDestinations = [];
  #boardOffers = [];

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    // 1. Подготавливаем данные
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];

    // 2. Вызываем рендеринг
    this.#renderBoard();
  }

  // Вспомогательный приватный метод для отрисовки всей "доски"
  #renderBoard() {
    render(new SortingView(), this.#boardContainer);
    render(this.#listComponent, this.#boardContainer);

    // Отрисовываем форму редактирования для первой точки
    if (this.#boardPoints.length > 0) {
      render(new PointEditView({
        point: this.#boardPoints[0],
        destinations: this.#boardDestinations,
        offers: this.#boardOffers
      }), this.#listComponent.getElement());
    }

    render(new PointAddView(), this.#listComponent.getElement());

    // Отрисовываем список точек
    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  // Приватный метод для отрисовки одной точки
  #renderPoint(point) {
    const pointComponent = new PointView({
      point,
      destinations: this.#boardDestinations,
      offers: this.#boardOffers
    });
    render(pointComponent, this.#listComponent.getElement());
  }
}

