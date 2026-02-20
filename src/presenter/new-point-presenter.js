import {render, remove, RenderPosition} from '../framework/render.js';
import PointAddView from '../view/point-add-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #listContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointAddComponent = null;
  #handleModeChange = null;

  constructor({ listContainer, onDataChange, onDestroy, onModeChange }) {
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#handleModeChange = onModeChange;
  }

  init(destinations, offers) {
    if (this.#pointAddComponent !== null) {
      return;
    }

    this.#handleModeChange?.();

    this.#pointAddComponent = new PointAddView({
      destinations,
      offers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick,
    });

    render(this.#pointAddComponent, this.#listContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointAddComponent === null) {
      return;
    }

    this.#handleDestroy?.();

    remove(this.#pointAddComponent);
    this.#pointAddComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = async (point) => {
    this.#pointAddComponent.setSaving();

    try {
      await this.#handleDataChange?.(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point,
      );
      this.destroy();
    } catch (err) {
      this.#pointAddComponent.setAborting();
    }
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

  setAborting() {
    this.#pointAddComponent.setAborting();
  }
}
