import { render, replace } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListView from '../view/list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import NoPointView from '../view/no-point-view.js'; // Импортируем заглушку
import { FilterType } from '../const.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #boardContainer = null;
  #pointsModel = null;
  #boardPoints = [];

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
    // 1. Если точек нет, показываем только заглушку
    if (this.#boardPoints.length === 0) {
      render(new NoPointView({
        filterType: FilterType.FUTURE
        // filterType: FilterType.EVERYTHING // Пока передаем дефолтный тип
      }), this.#boardContainer);

      return; // Прекращаем выполнение, чтобы не рисовать сортировку и список
    }

    // 2. Если точки есть, рисуем всё остальное
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

    // Создаем карточку (готовый компонент): передаем ГОТОВЫЙ город и ГОТОВЫЕ офферы
    pointComponent = new PointView({
      point,
      destination: this.#pointsModel.getDestinationById(point.destination), // Готовый объект города
      offers: this.#pointsModel.getOffersByType(point.type), // Массив офферов именно этого типа
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    // Создаем компонент формы редактирования
    pointEditComponent = new PointEditView({
      point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      offers: this.#pointsModel.getOffersByType(point.type),
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
