import {render, remove, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType, BLANK_POINT} from '../const.js';

export default class NewPointPresenter {
  #listContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointEditComponent = null;
  #destinations = null;
  #offers = null;
  #handleModeChange = null;

  constructor({ listContainer, onDataChange, onDestroy, onModeChange }) {
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#handleModeChange = onModeChange;
  }

  init(container, destinations, offers) {
    this.#listContainer = container;
    this.#destinations = destinations;
    this.#offers = offers;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      point: BLANK_POINT,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCancelClick,
      isNewPoint: true,
    });

    render(this.#pointEditComponent, this.#listContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = async (point) => {
    this.#pointEditComponent.setSaving();

    try {
      await this.#handleDataChange?.(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point,
      );
    } catch (err) {
      this.#pointEditComponent.setAborting();
    }
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.destroy();
    }
  };

  setAborting() {
    this.#pointEditComponent.setAborting();
  }
}
