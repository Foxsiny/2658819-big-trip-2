import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {Mode, UserAction, UpdateType} from '../const.js';

export default class PointPresenter {
  #listContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({listContainer, onDataChange, onModeChange}) {
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, destinations, offers) {
    this.#point = point;

    if (!destinations || destinations.length === 0 || !offers || offers.length === 0) {
      return;
    }

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const destination = destinations.find((d) => String(d.id) === String(this.#point.destination));
    const offersByType = offers.find((o) => o.type === this.#point.type)?.offers || [];

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: destination,
      offers: offersByType, // Передаем только офферы нужного типа
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: destinations,
      offers: offers,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#listContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      if (prevPointEditComponent) {
        replace(this.#pointComponent, prevPointEditComponent);
      }
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point); // Сброс данных
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    this.#handleModeChange?.();
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = async () => {
    try {
      await this.#handleDataChange?.(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        {...this.#point, isFavorite: !this.#point.isFavorite}
      );
    } catch (err) {
      this.#pointComponent.shake(); // Трясем карточку, если ошибка
    }
  };

  #handleRollupClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleFormSubmit = async (point) => {
    this.#pointEditComponent.setSaving();

    try {
      await this.#handleDataChange?.(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point,
      );
    } catch (err) {
      this.#pointEditComponent.setAborting();
    }
  };

  #handleDeleteClick = async (point) => {
    this.#pointEditComponent.setDeleting();

    try {
      await this.#handleDataChange?.(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point,
      );
    } catch (err) {
      this.#pointEditComponent.setAborting();
    }
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }


  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    this.#pointEditComponent.setAborting();
  }
}
