import {render, replace} from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListView from '../view/list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

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

    this.#boardPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  // Приватный метод для отрисовки одной точки
  #renderPoint(point) {

    // 1. Объявляем переменные через let (они пока пустые)
    let pointComponent = null;
    let pointEditComponent = null;

    const replaceCardToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToCard = () => {
      replace(pointComponent, pointEditComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    // Создаем компонент карточки точки
    pointComponent = new PointView({
      point,
      destinations: this.#boardDestinations,
      offers: this.#boardOffers,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    // Создаем компонент формы редактирования
    pointEditComponent = new PointEditView({
      point,
      destinations: this.#boardDestinations,
      offers: this.#boardOffers,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onRollupClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    render(pointComponent, this.#listComponent.element);
  }
}

