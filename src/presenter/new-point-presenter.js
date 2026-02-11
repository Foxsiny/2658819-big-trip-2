import { render, remove, RenderPosition } from '../framework/render.js';
import PointAddView from '../view/point-add-view.js'; // Используем твой файл
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #listContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointAddComponent = null;

  constructor({ listContainer, onDataChange, onDestroy }) {
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(destinations, offers) {
    if (this.#pointAddComponent !== null) {
      return;
    }

    this.#pointAddComponent = new PointAddView({
      destinations,
      offers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick, // Твой метод для кнопки Cancel
    });

    render(this.#pointAddComponent, this.#listContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointAddComponent === null) {
      return;
    }

    this.#handleDestroy(); // Разблокирует кнопку "New Event" в main.js

    remove(this.#pointAddComponent);
    this.#pointAddComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // В новой точке еще нет ID, модель добавит его сама или сервер
      { id: crypto.randomUUID(), ...point},
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
